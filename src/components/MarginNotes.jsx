import { useState } from "react";
import { useNotesStore } from "../store/notesStore";

const CATEGORY_STYLES = {
    general:        { bg: "bg-[#FFF3E0]", border: "border-[#E8A857]",  label: "📌 Note" },
    architecture:   { bg: "bg-[#FFF3E0]", border: "border-[#E8A857]",  label: "🏛️ Architecture" },
    constraint:     { bg: "bg-red-50",    border: "border-red-200",     label: "⚠️ Constraint" },
    recommendation: { bg: "bg-green-50",  border: "border-green-200",   label: "💡 Recommendation" },
};

function NoteCard({ note, onRemove, onToggleStar }) {
    const s = CATEGORY_STYLES[note.category] || CATEGORY_STYLES.general;
    return (
        <div className={`${s.bg} border-l-4 ${s.border} rounded-r-xl px-3 py-2.5 group relative`}>
            <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B4C3B]">
          {s.label}
        </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleStar(note.id)} className="text-xs hover:scale-110 transition-transform">
                        {note.starred ? "⭐" : "☆"}
                    </button>
                    <button onClick={() => onRemove(note.id)} className="text-[#9B7B6B] hover:text-red-500 text-xs transition-colors">
                        ✕
                    </button>
                </div>
            </div>
            <p className="text-xs leading-relaxed text-[#2C1810]">{note.text}</p>
        </div>
    );
}

export default function MarginNotes({ projectId }) {
    const { getProjectNotes, addNote, removeNote, toggleStar } = useNotesStore();
    const notes   = getProjectNotes(projectId);
    const starred = notes.filter((n) => n.starred);

    const [input,    setInput]    = useState("");
    const [category, setCategory] = useState("general");
    const [showAll,  setShowAll]  = useState(false);

    const displayed = showAll ? notes : starred;

    const handleAdd = () => {
        if (!input.trim()) return;
        addNote(projectId, input.trim(), category);
        setInput("");
    };

    return (
        <aside className="w-56 border-l border-[rgba(193,123,63,0.12)] bg-[#FDFAF6] flex flex-col overflow-hidden flex-shrink-0">
            {/* Header */}
            <div className="px-4 py-4 border-b border-[rgba(193,123,63,0.1)]">
                <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-serif text-sm font-bold text-[#2C1810]">Margin Notes</h3>
                    <span className="text-xs bg-[#FFF3E0] text-[#C17B3F] px-2 py-0.5 rounded-full font-medium">
            {starred.length} ⭐
          </span>
                </div>
                <p className="text-[10px] text-[#9B7B6B] italic">Starred notes persist across sessions</p>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {displayed.length === 0 && (
                    <div className="text-center py-6">
                        <div className="text-2xl mb-2">⭐</div>
                        <p className="text-xs text-[#9B7B6B] italic">
                            {showAll ? "No notes yet" : "No starred notes yet"}
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

            {/* Toggle */}
            {notes.length > 0 && (
                <button
                    onClick={() => setShowAll((v) => !v)}
                    className="text-[10px] text-[#9B7B6B] hover:text-[#C17B3F] transition-colors py-1.5 border-t border-[rgba(193,123,63,0.08)]"
                >
                    {showAll ? "Show starred only" : `Show all (${notes.length})`}
                </button>
            )}

            {/* Add note */}
            <div className="px-3 py-3 border-t border-[rgba(193,123,63,0.1)] space-y-2">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs bg-white border border-[rgba(193,123,63,0.2)] rounded-xl px-2 py-1.5 text-[#6B4C3B] outline-none focus:border-[#C17B3F] cursor-pointer"
                >
                    <option value="general">📌 General Note</option>
                    <option value="architecture">🏛️ Architecture</option>
                    <option value="constraint">⚠️ Constraint</option>
                    <option value="recommendation">💡 Recommendation</option>
                </select>
                <div className="flex gap-1.5">
                    <input
                        className="flex-1 text-xs bg-white border border-[rgba(193,123,63,0.2)] rounded-xl px-2.5 py-2 text-[#2C1810] placeholder:text-[#9B7B6B] outline-none focus:border-[#C17B3F]"
                        placeholder="Add a note..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!input.trim()}
                        className="w-8 h-8 bg-[#FFF3E0] border border-[#E8A857] rounded-xl text-[#C17B3F] text-sm hover:bg-[#C17B3F] hover:text-white transition-all disabled:opacity-40 flex-shrink-0"
                    >
                        +
                    </button>
                </div>
            </div>
        </aside>
    );
}