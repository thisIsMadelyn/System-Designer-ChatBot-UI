import { create } from "zustand";

// ── Mock user for development ──────────────────────────────────
const MOCK_USER = {
    id: "user-001",
    name: "Alex Developer",
    email: "alex@devco.io",
    avatar: "AD",
};

export const useAuthStore = create((set) => ({
    user: null,   // null = not logged in

    // Mock login — accepts any email/password combo
    login: (email, _password) => {
        const user = { ...MOCK_USER, email };
        localStorage.setItem("sda_user", JSON.stringify(user));
        set({ user });
    },

    // Restore session on page reload
    restoreSession: () => {
        const saved = localStorage.getItem("sda_user");
        if (saved) set({ user: JSON.parse(saved) });
    },

    logout: () => {
        localStorage.removeItem("sda_user");
        set({ user: null });
    },
}));