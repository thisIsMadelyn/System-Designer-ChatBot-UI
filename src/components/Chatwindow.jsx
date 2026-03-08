import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Terminal, MessageSquare, Trash2, Cpu } from "lucide-react";

function LoadingBubble() {
    return (
        <div className="flex gap-4 mb-6 fade-up">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#bb29ff] to-[#2d233e] flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(187,41,255,0.3)]">
                <Cpu size={18} className="text-white animate-pulse" />
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1.5 ml-1">AI Processor</div>
                <div className="bg-[#1a1425]/60 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 backdrop-blur-md shadow-xl">
                    <div className="text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-tighter">Analyzing_Parameters...</div>
                    <div className="flex gap-1.5">
                        {[0, 150, 300].map((d) => (
                            <div
                                key={d}
                                className="w-2 h-2 rounded-full bg-[#bb29ff] animate-bounce"
                                style={{ animationDelay: `${d}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatWindow({ messages, loading, onSend, onClear }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full gap-6 text-center fade-up">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#bb29ff] blur-[40px] opacity-20"></div>
                            <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-2xl backdrop-blur-sm">
                                <MessageSquare size={40} className="text-[#bb29ff]" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white mb-2 tracking-tight">AI Terminal Node</div>
                            <div className="text-sm text-gray-500 max-w-xs leading-relaxed font-medium">
                                Ask questions about <span className="text-purple-400">Spring Boot</span>, <span className="text-purple-400">System Design</span>, or request code optimizations.
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 font-mono">STATUS: ONLINE</span>
                            <span className="text-[10px] px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-mono">ENCRYPTED</span>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {loading && <LoadingBubble />}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="px-6 pb-6 pt-4 bg-gradient-to-t from-[#0f0a1a] to-transparent">
                <div className="flex items-center justify-between mb-3 px-1">
                    {messages.length > 0 && (
                        <button
                            onClick={onClear}
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 transition-all group"
                        >
                            <Trash2 size={12} className="group-hover:rotate-12" />
                            Purge History
                        </button>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        READY_FOR_PROMPT
                    </div>
                </div>

                {/* Το ChatInput πρέπει να είναι και αυτό Dark - θα το διορθώσουμε αν χρειαστεί */}
                <div className="relative z-10">
                    <ChatInput onSend={onSend} loading={loading} />
                </div>
            </div>
        </div>
    );
}