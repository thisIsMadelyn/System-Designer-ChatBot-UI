import { useState, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { sendChat, streamDesignForm } from "../services/chatService";

export function useChat(sessionId) {
    const { addMessage, getMessages, clearSession } = useChatStore();
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);
    const [progress, setProgress] = useState(null);

    const cancelStreamRef = useRef(null);
    const messages = getMessages(sessionId);

    // ── Free-form chat ────────────────────────────────────────
    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;
        setError(null);

        addMessage(sessionId, {
            id:        Date.now(),
            role:      "user",
            content:   text,
            createdAt: new Date().toISOString(),
        });

        setLoading(true);
        try {
            const result = await sendChat(sessionId, text);
            addMessage(sessionId, {
                id:               Date.now() + 1,
                role:             "assistant",
                content:          result.answer,
                structuredOutput: result.structured_output ?? null,
                createdAt:        new Date().toISOString(),
            });
        } catch (e) {
            addMessage(sessionId, {
                id:        Date.now() + 1,
                role:      "assistant",
                content:   `❌ Error: ${e.message || "Something went wrong"}`,
                createdAt: new Date().toISOString(),
            });
        } finally {
            setLoading(false);
        }
    };

    // ── Design form → SSE stream ──────────────────────────────
    const submitDesignForm = (projectId, formData) => {
        if (loading) return Promise.resolve(null);
        setError(null);
        setLoading(true);
        setProgress({ agent: "Starting...", step: 0, total: 6, pct: 0 });

        addMessage(sessionId, {
            id:      Date.now(),
            role:    "user",
            content: [
                `🗂 **Design Request:** ${formData.project_description}`,
                `👥 ${formData.team_size}`,
                `📈 ${formData.scale}`,
                `⏰ ${formData.deadline}`,
                `💰 ${formData.capital_constraints}`,
                formData.tech_constraints ? `🔧 ${formData.tech_constraints}` : "",
                formData.extra_details    ? `📝 ${formData.extra_details}`    : "",
            ].filter(Boolean).join("  \n"),
            createdAt: new Date().toISOString(),
        });

        const history = getMessages(sessionId)
            .slice(-10)
            .map(m => ({ role: m.role, content: m.content }));

        return new Promise((resolve) => {
            cancelStreamRef.current = streamDesignForm(
                projectId, formData, history,
                {
                    onProgress: (data) => setProgress(data),

                    onDone: (result) => {
                        setLoading(false);
                        setProgress(null);
                        addMessage(sessionId, {
                            id:               Date.now() + 1,
                            role:             "assistant",
                            content:          result.response,
                            structuredOutput: result.structured_output ?? null,
                            createdAt:        new Date().toISOString(),
                        });
                        resolve({
                            structured_output: result.structured_output,
                            form_id:           result.form_id,
                        });
                    },

                    onError: (msg) => {
                        setLoading(false);
                        setProgress(null);
                        setError(msg);
                        addMessage(sessionId, {
                            id:        Date.now() + 1,
                            role:      "assistant",
                            content:   `❌ Pipeline error: ${msg}`,
                            createdAt: new Date().toISOString(),
                        });
                        resolve(null);
                    },
                }
            );
        });
    };

    const cancelStream = () => {
        cancelStreamRef.current?.();
        setLoading(false);
        setProgress(null);
    };

    const clear = () => clearSession(sessionId);

    return { messages, loading, error, progress, sendMessage, submitDesignForm, cancelStream, clear };
}

// import { useState } from "react";
// import { useChatStore } from "../store/chatStore";
// import { sendChat, sendDesignForm } from "../services/chatService";
//
// export function useChat(sessionId) {
//     const { addMessage, getMessages, clearSession } = useChatStore();
//     const [loading, setLoading] = useState(false);
//     const [error, setError]     = useState(null);
//
//     const messages = getMessages(sessionId);
//
//     const sendMessage = async (text) => {
//         if (!text.trim() || loading) return;
//         setError(null);
//
//         // Add user message immediately
//         addMessage(sessionId, {
//             id:   Date.now(),
//             role: "user",
//             content: text,
//             createdAt: new Date().toISOString(),
//         });
//
//         setLoading(true);
//         try {
//             const result = await sendChat(sessionId, text);
//             addMessage(sessionId, {
//                 id:               Date.now() + 1,
//                 role:             "assistant",
//                 content:          result.answer,
//                 structuredOutput: result.structured_output,
//                 createdAt:        new Date().toISOString(),
//             });
//         } catch (e) {
//             setError(e.message || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const submitDesignForm = async (formData) => {
//         if (loading) return;
//         setError(null);
//         setLoading(true);
//
//         // Add a "user" summary message
//         addMessage(sessionId, {
//             id:   Date.now(),
//             role: "user",
//             content: `🗂 Design Request: **${formData.project_description}**\n\n` +
//                 `👥 ${formData.team_size} · 📈 ${formData.scale} · ⏰ ${formData.deadline} · 💰 ${formData.capital_constraints}`,
//             createdAt: new Date().toISOString(),
//         });
//
//         try {
//             const result = await sendDesignForm({ session_id: sessionId, ...formData });
//             addMessage(sessionId, {
//                 id:               Date.now() + 1,
//                 role:             "assistant",
//                 content:          result.answer,
//                 structuredOutput: result.structured_output,
//                 createdAt:        new Date().toISOString(),
//             });
//             return result.structured_output;
//         } catch (e) {
//             setError(e.message || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const clear = () => clearSession(sessionId);
//
//     return { messages, loading, error, sendMessage, submitDesignForm, clear };
// }