import { create } from "zustand";

const STORAGE_KEY = "sda_notes";

function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
}

function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const useNotesStore = create((set, get) => ({
    notes: load(),

    addNote: (projectId, text, category = "general") => {
        const note = {
            id:        Date.now(),
            text,
            category,
            starred:   true,
            createdAt: new Date().toISOString(),
        };
        const updated = {
            ...get().notes,
            [projectId]: [note, ...(get().notes[projectId] || [])],
        };
        save(updated);
        set({ notes: updated });
    },

    removeNote: (projectId, noteId) => {
        const updated = {
            ...get().notes,
            [projectId]: (get().notes[projectId] || []).filter((n) => n.id !== noteId),
        };
        save(updated);
        set({ notes: updated });
    },

    toggleStar: (projectId, noteId) => {
        const updated = {
            ...get().notes,
            [projectId]: (get().notes[projectId] || []).map((n) =>
                n.id === noteId ? { ...n, starred: !n.starred } : n
            ),
        };
        save(updated);
        set({ notes: updated });
    },

    getProjectNotes: (projectId) => get().notes[projectId] || [],
}));