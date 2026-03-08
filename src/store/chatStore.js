import { create } from "zustand";

export const useChatStore = create((set, get) => ({
    // { [sessionId]: Message[] }
    sessions: {},
    activeSessionId: null,

    initSession: (sessionId) => {
        const { sessions } = get();
        if (!sessions[sessionId]) {
            set((s) => ({
                sessions: { ...s.sessions, [sessionId]: [] },
                activeSessionId: sessionId,
            }));
        } else {
            set({ activeSessionId: sessionId });
        }
    },

    addMessage: (sessionId, message) =>
        set((s) => ({
            sessions: {
                ...s.sessions,
                [sessionId]: [...(s.sessions[sessionId] || []), message],
            },
        })),

    getMessages: (sessionId) => get().sessions[sessionId] || [],

    clearSession: (sessionId) =>
        set((s) => ({
            sessions: { ...s.sessions, [sessionId]: [] },
        })),
}));