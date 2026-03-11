import api from "./api";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";


export async function sendChat(sessionId, message) {
    const { data } = await api.post("/api/chat", {
        session_id: sessionId,
        message,
    });
    return data;
}

export function streamDesignForm(projectId, formData, history = [], {
    onProgress,
    onDone,
    onError,
}) {
    const controller = new AbortController();
    const token      = localStorage.getItem("sda_token");

    fetch(`${BASE}/api/projects/${projectId}/run/stream`, {
        method:  "POST",
        headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body:   JSON.stringify({ ...formData, history }),
        signal: controller.signal,
    })
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                onError?.(`Server error: ${res.status} — ${text}`);
                return;
            }

            const reader  = res.body.getReader();
            const decoder = new TextDecoder();
            let   buffer  = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop();

                for (const part of parts) {
                    const line = part.trim();
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const event = JSON.parse(line.slice(6));
                        if      (event.type === "progress") onProgress?.(event);
                        else if (event.type === "done")     onDone?.(event);
                        else if (event.type === "error")    onError?.(event.message);
                    } catch {
                        // ignore malformed lines
                    }
                }
            }
        })
        .catch((err) => {
            if (err.name !== "AbortError") onError?.(err.message || "Stream failed");
        });

    return () => controller.abort();
}


export async function fetchHistory(sessionId) {
    const { data } = await api.get(`/api/chat/history/${sessionId}`);
    return data.messages;
}

export async function clearHistory(sessionId) {
    await api.delete(`/api/chat/history/${sessionId}`);
}