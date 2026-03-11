// frontend/src/hooks/useChat.js
//
// Αλλαγές από την παλιά έκδοση:
//   - submitDesignForm δέχεται πλέον projectId (χρειάζεται για το /run endpoint)
//   - Περνάμε το chat history στο backend για context
//   - Το result έχει πλέον { form_id, response, structured_output } αντί για { answer, ... }

import { useState } from "react";
import { useChatStore } from "../store/chatStore";
import { sendChat, sendDesignForm } from "../services/chatService";

export function useChat(sessionId) {
    const { addMessage, getMessages, clearSession } = useChatStore();
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    const messages = getMessages(sessionId);

    // ── Free-form chat ────────────────────────────────────────
    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;
        setError(null);

        // Προσθέτουμε το user message αμέσως (optimistic UI)
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
            setError(e.message || "Something went wrong");
            // Προσθέτουμε error message στο chat για visibility
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

    // ── Design form submission → 6-agent pipeline ─────────────
    //
    // ΣΗΜΑΝΤΙΚΟ: Δέχεται πλέον projectId για να χτίσει το σωστό URL
    // Επιστρέφει το structured_output για να το εμφανίσει το ProjectDashboard
    const submitDesignForm = async (projectId, formData) => {
        if (loading) return null;
        setError(null);
        setLoading(true);

        // User summary message στο chat
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
            ].filter(Boolean).join("  \n"),  // markdown line breaks
            createdAt: new Date().toISOString(),
        });

        try {
            // Στέλνουμε και το chat history για context στους agents
            const currentMessages = getMessages(sessionId);
            const history = currentMessages
                .slice(-10)  // τελευταία 10 μηνύματα — αρκούν για context
                .map(m => ({ role: m.role, content: m.content }));

            const result = await sendDesignForm(projectId, formData, history);

            // Assistant bubble με το markdown summary
            addMessage(sessionId, {
                id:               Date.now() + 1,
                role:             "assistant",
                content:          result.response,  // νέο field name (ήταν result.answer)
                structuredOutput: result.structured_output ?? null,
                createdAt:        new Date().toISOString(),
            });

            // Επιστρέφουμε { structured_output, form_id } στο ProjectDashboard
            return {
                structured_output: result.structured_output,
                form_id:           result.form_id,
            };

        } catch (e) {
            setError(e.message || "Pipeline failed");
            addMessage(sessionId, {
                id:      Date.now() + 1,
                role:    "assistant",
                content: `❌ Pipeline error: ${e.message || "Something went wrong"}`,
                createdAt: new Date().toISOString(),
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clear = () => clearSession(sessionId);

    return { messages, loading, error, sendMessage, submitDesignForm, clear };
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