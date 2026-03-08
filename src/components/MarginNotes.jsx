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
    const [showAll,  setShowAll]  = useState(true); // Default σε true για το Dashboard

    const displayed = showAll ? notes : starred;

    const handleAdd = () => {
        if (!input.trim()) return;
        addNote(projectId, input.trim(), category);
        setInput("");
    };

    return (
        <aside className="w-64 bg-[#1a1425]/40 backdrop-blur-xl border-l border-white/5 flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-5 py-5 border-b border-white/5 bg-white/5">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Knowledge Base</h3>
                    <div className="flex items-center gap-1.5 bg-[#bb29ff]/10 px-2 py-0.5 rounded-full border border-[#bb29ff]/20">
                        <Star size={10} className="fill-[#bb29ff] text-[#bb29ff]" />
                        <span className="text-[10px] font-bold text-[#bb29ff]">{starred.length}</span>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Persistent Project Insights</p>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
                {displayed.length === 0 && (
                    <div className="text-center py-10 opacity-20">
                        <StickyNote size={32} className="mx-auto mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                            {showAll ? "No Entries" : "No Starred Items"}
                        </p>
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

            {/* Toggle & Input Area */}
            <div className="mt-auto bg-white/5 border-t border-white/5 p-4 space-y-3">
                {notes.length > 0 && (
                    <button
                        onClick={() => setShowAll((v) => !v)}
                        className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] transition-colors mb-1"
                    >
                        {showAll ? "Filter Starred" : `Show All (${notes.length})`}
                    </button>
                )}

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-[10px] font-bold uppercase bg-[#0f0a1a] border border-white/10 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#bb29ff] cursor-pointer"
                >
                    <option value="general">General Note</option>
                    <option value="architecture">🏛Architecture</option>
                    <option value="constraint">⚠Constraint</option>
                    <option value="recommendation">Recommendation</option>
                </select>

                <div className="flex gap-2">
                    <input
                        className="flex-1 text-xs bg-[#0f0a1a] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 outline-none focus:border-[#bb29ff]"
                        placeholder="Log insight..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!input.trim()}
                        className="w-10 h-10 bg-[#bb29ff] rounded-xl text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-[0_0_15px_rgba(187,41,255,0.2)]"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}