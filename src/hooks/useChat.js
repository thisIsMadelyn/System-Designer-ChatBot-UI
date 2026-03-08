import { useState } from "react";
import { useChatStore } from "../store/chatStore";
import { sendChat, sendDesignForm } from "../services/chatService";

export function useChat(sessionId) {
    const { addMessage, getMessages, clearSession } = useChatStore();
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const messages = getMessages(sessionId);

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;
        setError(null);

        // Add user message immediately
        addMessage(sessionId, {
            id:   Date.now(),
            role: "user",
            content: text,
            createdAt: new Date().toISOString(),
        });

        setLoading(true);
        try {
            const result = await sendChat(sessionId, text);
            addMessage(sessionId, {
                id:               Date.now() + 1,
                role:             "assistant",
                content:          result.answer,
                structuredOutput: result.structured_output,
                createdAt:        new Date().toISOString(),
            });
        } catch (e) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const submitDesignForm = async (formData) => {
        if (loading) return;
        setError(null);
        setLoading(true);

        // Add a "user" summary message
        addMessage(sessionId, {
            id:   Date.now(),
            role: "user",
            content: `🗂 Design Request: **${formData.project_description}**\n\n` +
                `👥 ${formData.team_size} · 📈 ${formData.scale} · ⏰ ${formData.deadline} · 💰 ${formData.capital_constraints}`,
            createdAt: new Date().toISOString(),
        });

        try {
            const result = await sendDesignForm({ session_id: sessionId, ...formData });
            addMessage(sessionId, {
                id:               Date.now() + 1,
                role:             "assistant",
                content:          result.answer,
                structuredOutput: result.structured_output,
                createdAt:        new Date().toISOString(),
            });
            return result.structured_output;
        } catch (e) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const clear = () => clearSession(sessionId);

    return { messages, loading, error, sendMessage, submitDesignForm, clear };
}