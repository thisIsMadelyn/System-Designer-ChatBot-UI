import { useState } from "react";
import { Send, Zap } from "lucide-react";

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
        <div className="flex gap-3 items-end relative group">
            {/* Input Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#bb29ff] to-blue-600 rounded-2xl blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>

            <textarea
                rows={1}
                className="relative flex-1 bg-[#1a1425]/50 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none resize-none transition-all focus:border-[#bb29ff] focus:bg-[#1a1425]/80 max-h-32 overflow-y-auto custom-scrollbar"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKey}
            />

            <button
                onClick={handleSend}
                disabled={!value.trim() || loading}
                className="relative w-12 h-12 rounded-xl bg-[#bb29ff] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(187,41,255,0.3)] hover:shadow-[0_0_30px_rgba(187,41,255,0.5)] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex-shrink-0"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <Send size={18} className="ml-0.5" />
                )}
            </button>
        </div>
    );
}