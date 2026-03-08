import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user:  null,
    token: null,

    setAuth: (user, token) => {
        localStorage.setItem("sda_token", token);
        localStorage.setItem("sda_user",  JSON.stringify(user));
        set({ user, token });
    },

    restoreSession: () => {
        const token = localStorage.getItem("sda_token");
        const raw   = localStorage.getItem("sda_user");
        if (token && raw) {
            set({ token, user: JSON.parse(raw) });
        }
    },

    logout: () => {
        localStorage.removeItem("sda_token");
        localStorage.removeItem("sda_user");
        set({ user: null, token: null });
    },
}));