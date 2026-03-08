import { useState } from "react";

export default function ChatInput({ onSend, loading, placeholder = "Ask a question..." }) {
    const [value, setValue] = useState("");

    const handleSend = () => {
        if (!value.trim() || loading) return;
        onSend(value.trim());
        setValue("");
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex gap-2 items-end">
      <textarea
          rows={1}
          className="flex-1 bg-[#FFFDF9] border border-[rgba(193,123,63,0.2)] rounded-2xl px-4 py-3 text-sm text-espresso placeholder:text-latte outline-none resize-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/10 focus:bg-white max-h-32 overflow-y-auto"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
      />
            <button
                onClick={handleSend}
                disabled={!value.trim() || loading}
                className="w-11 h-11 rounded-xl bg-amber-light border border-amber-border text-amber flex items-center justify-center text-base transition-all hover:bg-amber hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-amber border-t-transparent rounded-full animate-spin" />
                ) : "➤"}
            </button>
        </div>
    );
}