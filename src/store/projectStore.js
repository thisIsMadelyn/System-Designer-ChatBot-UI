import { create } from "zustand";
import api from "../services/api";

export const useProjectStore = create((set, get) => ({
    projects:      [],
    loading:       false,
    error:         null,

    fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.get("/api/projects");
            set({ projects: data });
        } catch (e) {
            set({ error: e.message });
        } finally {
            set({ loading: false });
        }
    },

    addProject: async (name, description) => {
        const { data } = await api.post("/api/projects", { name, description });
        set((s) => ({ projects: [data, ...s.projects] }));
        return data;
    },

    deleteProject: async (id) => {
        await api.delete(`/api/projects/${id}`);
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
    },

    bumpDesignCount: (id) =>
        set((s) => ({
            projects: s.projects.map((p) =>
                p.id === id
                    ? { ...p, designCount: (p.designCount || 0) + 1 }
                    : p
            ),
        })),
}));