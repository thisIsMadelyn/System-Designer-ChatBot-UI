import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

function LoadingBubble() {
    return (
        <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center text-sm flex-shrink-0 mt-1">
                🤖
            </div>
            <div>
                <div className="text-xs text-latte mb-1.5">System Designer</div>
                <div className="bg-white border border-[rgba(193,123,63,0.1)] rounded-[18px] rounded-tl-sm px-5 py-4 shadow-warm">
                    <div className="text-xs text-latte mb-2">Thinking...</div>
                    <div className="flex gap-1.5">
                        {[0, 150, 300].map((d) => (
                            <div
                                key={d}
                                className="w-2 h-2 rounded-full bg-amber dot-pulse"
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
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-light to-[#FFE0B2] flex items-center justify-center text-3xl shadow-warm">
                            💬
                        </div>
                        <div className="font-serif text-xl font-bold text-espresso">Chat with the Assistant</div>
                        <div className="text-sm text-latte italic max-w-xs leading-relaxed">
                            Ask questions about Spring Boot, JWT, system design, or anything architecture-related.
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}

                {loading && <LoadingBubble />}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 pb-5 pt-3 border-t border-[rgba(193,123,63,0.1)]">
                {messages.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-xs text-latte hover:text-amber transition-colors mb-2"
                    >
                        Clear conversation
                    </button>
                )}
                <ChatInput onSend={onSend} loading={loading} />
            </div>
        </div>
    );
}