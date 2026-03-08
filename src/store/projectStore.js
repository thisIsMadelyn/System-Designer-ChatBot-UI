import { create } from "zustand";

// Simple ID helper (no uuid dependency needed)
const newId = () => `proj-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

const MOCK_PROJECTS = [
    {
        id: "proj-001",
        name: "E-Commerce Platform",
        description: "Online shop with auth, catalog, and orders",
        createdAt: new Date("2026-02-15").toISOString(),
        lastDesignAt: new Date("2026-03-01").toISOString(),
        designCount: 3,
    },
    {
        id: "proj-002",
        name: "Banking App",
        description: "Accounts, transfers, and transaction history",
        createdAt: new Date("2026-03-01").toISOString(),
        lastDesignAt: new Date("2026-03-05").toISOString(),
        designCount: 1,
    },
];

export const useProjectStore = create((set, get) => ({
    projects: MOCK_PROJECTS,
    activeProject: null,

    setActiveProject: (project) => set({ activeProject: project }),

    addProject: (name, description) => {
        const project = {
            id: newId(),
            name,
            description,
            createdAt: new Date().toISOString(),
            lastDesignAt: null,
            designCount: 0,
        };
        set((s) => ({ projects: [project, ...s.projects] }));
        return project;
    },

    deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

    bumpDesignCount: (id) =>
        set((s) => ({
            projects: s.projects.map((p) =>
                p.id === id
                    ? { ...p, designCount: p.designCount + 1, lastDesignAt: new Date().toISOString() }
                    : p
            ),
        })),
}));