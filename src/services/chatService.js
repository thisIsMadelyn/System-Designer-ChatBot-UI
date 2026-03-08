import api from "./api";

/**
 * Send a free-form chat message.
 */
export async function sendChat(sessionId, message) {
    const { data } = await api.post("/api/chat", {
        session_id: sessionId,
        message,
    });
    return data; // { session_id, answer, structured_output }
}

/**
 * Submit the structured design form — triggers full 4-agent pipeline.
 */
export async function sendDesignForm(formData) {
    const { data } = await api.post("/api/chat/design", formData);
    return data; // { session_id, answer, structured_output }
}

/**
 * Fetch conversation history for a session.
 */
export async function fetchHistory(sessionId) {
    const { data } = await api.get(`/api/chat/history/${sessionId}`);
    return data.messages; // [{ role, content }]
}

/**
 * Clear conversation history for a session.
 */
export async function clearHistory(sessionId) {
    await api.delete(`/api/chat/history/${sessionId}`);
}