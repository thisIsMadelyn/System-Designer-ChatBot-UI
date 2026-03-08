import { useState } from "react";
import { useNotesStore } from "../store/notesStore";
import { Star, X, Plus, StickyNote, ShieldAlert, Lightbulb, Landmark } from "lucide-react";

const CATEGORY_STYLES = {
    general:        { bg: "bg-white/5",     border: "border-gray-500/30",   text: "text-gray-300",   label: "Note",          icon: <StickyNote size={12} /> },
    architecture:   { bg: "bg-blue-500/10", border: "border-blue-500/40",   text: "text-blue-300",   label: "Architecture",  icon: <Landmark size={12} /> },
    constraint:     { bg: "bg-red-500/10",  border: "border-red-500/40",    text: "text-red-300",    label: "Constraint",    icon: <ShieldAlert size={12} /> },
    recommendation: { bg: "bg-green-500/10", border: "border-green-500/40", text: "text-green-300",  label: "Recommendation", icon: <Lightbulb size={12} /> },
};

function NoteCard({ note, onRemove, onToggleStar }) {
    const s = CATEGORY_STYLES[note.category] || CATEGORY_STYLES.general;
    return (
        <div className={`${s.bg} border-l-2 ${s.border} rounded-r-xl px-3 py-3 group relative transition-all hover:bg-white/10`}>
            <div className="flex items-center justify-between mb-1.5">
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${s.text}`}>
                    {s.icon} <span>{s.label}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStar(note.id)} className="hover:scale-110 transition-transform">
                        <Star size={12} className={note.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-500"} />
                    </button>
                    <button onClick={() => onRemove(note.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <X size={12} />
                    </button>
                </div>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-300">{note.text}</p>
        </div>
    );
}

export default function MarginNotes({ projectId }) {
    const { getProjectNotes, addNote, removeNote, toggleStar } = useNotesStore();
    const notes   = getProjectNotes(projectId);
    const starred = notes.filter((n) => n.starred);

    const [input,    setInput]    = useState("");
    const [category, setCategory] = useState("general");
    const [showAll,  setShowAll]  = useState(true);

    const displayed = showAll ? notes : starred;

    const handleAdd = () => {
        if (!input.trim()) return;
        addNote(projectId, input.trim(), category);
        setInput("");
    };
    // className="bg-[#1a1425] rounded-3xl p-6 border border-white/10"
    return (
        /* Διόρθωση: Προσθήκη h-full και αφαίρεση περιττών περιθωρίων αν υπάρχουν */
        <aside className="w-72 h-full bg-[#1a1425]/60 backdrop-blur-2xl border-l border-white/5 flex flex-col overflow-hidden shadow-2xl relative z-20">
            {/* Header */}
            <div className="px-6 py-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Knowledge Base</h3>
                    <div className="flex items-center gap-1.5 bg-[#bb29ff]/20 px-2 py-0.5 rounded-full border border-[#bb29ff]/30 shadow-[0_0_10px_rgba(187,41,255,0.2)]">
                        <Star size={10} className="fill-[#bb29ff] text-[#bb29ff]" />
                        <span className="text-[10px] font-bold text-[#bb29ff]">{starred.length}</span>
                    </div>
                </div>
            </div>

            {/* Notes list - Το flex-1 θα το κάνει να πάρει όλο τον διαθέσιμο χώρο */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
                {displayed.length === 0 && (
                    <div className="text-center py-20 opacity-20">
                        <StickyNote size={40} className="mx-auto mb-3" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No entries logged</p>
                    </div>
                )}
                {displayed.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onRemove={(id) => removeNote(projectId, id)}
                        onToggleStar={(id) => toggleStar(projectId, id)}
                    />
                ))}
            </div>

            {/* Bottom Actions & Input */}
            <div className="bg-black/20 border-t border-white/5 p-5 space-y-4">
                {notes.length > 0 && (
                    <button
                        onClick={() => setShowAll((v) => !v)}
                        className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] transition-all py-1"
                    >
                        {showAll ? "Filter Starred" : `View All (${notes.length})`}
                    </button>
                )}

                <div className="mt-auto bg-[#1a1425]/80 border-t border-white/5 p-5 space-y-4">
                    {/* Φίλτρο Starred */}
                    {notes.length > 0 && (
                        <button
                            onClick={() => setShowAll((v) => !v)}
                            className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] transition-all py-1 mb-2"
                        >
                            {showAll ? "Filter Starred" : `View All (${notes.length})`}
                        </button>
                    )}

                    <div className="space-y-3">
                        {/* Dropdown - Σκούρο background, Λευκά γράμματα */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full text-[10px] font-bold uppercase bg-[#0f0a1a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#bb29ff] cursor-pointer appearance-none shadow-inner"
                        >
                            <option value="general" className="bg-[#0f0a1a]">General Note</option>
                            <option value="architecture" className="bg-[#0f0a1a]">Architecture</option>
                            <option value="constraint" className="bg-[#0f0a1a]">Constraint</option>
                            <option value="recommendation" className="bg-[#0f0a1a]">Recommendation</option>
                        </select>

                        <div className="flex gap-2">
                            {/* Input - Σκούρο background, Λευκά γράμματα */}
                            <input
                                className="flex-1 text-sm bg-[#0f0a1a] text-white border border-white/10 rounded-xl px-4 py-3 placeholder:text-gray-600 outline-none focus:border-[#bb29ff] focus:ring-1 focus:ring-[#bb29ff]/30 transition-all shadow-inner"
                                placeholder="Type insight..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            />
                            {/* Κουμπί Προσθήκης */}
                            <button
                                onClick={handleAdd}
                                disabled={!input.trim()}
                                className="w-12 h-12 bg-[#bb29ff] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-[0_0_20px_rgba(187,41,255,0.4)]"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}