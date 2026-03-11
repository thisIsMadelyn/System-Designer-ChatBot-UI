// frontend/src/services/chatService.js
//
// Δύο τύποι calls:
//   sendChat()       → /api/chat          (free-form συνομιλία)
//   sendDesignForm() → /api/projects/{id}/run  (6-agent pipeline + MySQL save)

import api from "./api";

/**
 * Στέλνει ελεύθερο μήνυμα chat.
 * Επιστρέφει: { session_id, answer, structured_output }
 */
export async function sendChat(sessionId, message) {
    const { data } = await api.post("/api/chat", {
        session_id: sessionId,
        message,
    });
    return data;
}

/**
 * Υποβάλλει το design form — τρέχει το 6-agent pipeline.
 * Καλεί το νέο /api/projects/{projectId}/run endpoint.
 *
 * Επιστρέφει: { form_id, response, structured_output }
 *   - form_id:          ID της νέας InputForm εγγραφής στη MySQL
 *   - response:         markdown summary (για chat bubble)
 *   - structured_output: dict με τα 6 agent outputs
 */
export async function sendDesignForm(projectId, formData, history = []) {
    const { data } = await api.post(`/api/projects/${projectId}/run`, {
        ...formData,
        history,  // στέλνουμε chat history για context στους agents
    });
    return data;
}

/**
 * Φέρνει το αποθηκευμένο history ενός session.
 * Επιστρέφει: [{ role, content }]
 */
export async function fetchHistory(sessionId) {
    const { data } = await api.get(`/api/chat/history/${sessionId}`);
    return data.messages;
}

/**
 * Διαγράφει το history ενός session.
 */
export async function clearHistory(sessionId) {
    await api.delete(`/api/chat/history/${sessionId}`);
}

// import api from "./api";
//
// /**
//  * Send a free-form chat message.
//  */
// export async function sendChat(sessionId, message) {
//     const { data } = await api.post("/api/chat", {
//         session_id: sessionId,
//         message,
//     });
//     return data; // { session_id, answer, structured_output }
// }
//
// /**
//  * Submit the structured design form — triggers full 4-agent pipeline.
//  */
// export async function sendDesignForm(formData) {
//     const { data } = await api.post("/api/chat/design", formData);
//     return data; // { session_id, answer, structured_output }
// }
//
// /**
//  * Fetch conversation history for a session.
//  */
// export async function fetchHistory(sessionId) {
//     const { data } = await api.get(`/api/chat/history/${sessionId}`);
//     return data.messages; // [{ role, content }]
// }
//
// /**
//  * Clear conversation history for a session.
//  */
// export async function clearHistory(sessionId) {
//     await api.delete(`/api/chat/history/${sessionId}`);
// }