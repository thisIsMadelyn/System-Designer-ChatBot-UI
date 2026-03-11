import ReactMarkdown from "react-markdown";
import { Cpu } from "lucide-react";

export default function MessageBubble({ message }) {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex justify-end mb-6 fade-up">
                <div className="max-w-[75%]">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right mb-1.5 pr-1">
                        You
                    </div>
                    <div className="bg-[#bb29ff]/10 border border-[#bb29ff]/20 rounded-2xl rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed text-white">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 mb-6 fade-up">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#bb29ff] to-[#2d233e] flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(187,41,255,0.3)]">
                <Cpu size={16} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1.5 ml-1">
                    System Designer
                </div>
                <div className="bg-[#1a1425]/60 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 text-sm leading-relaxed backdrop-blur-md shadow-xl">
                    <ReactMarkdown
                        components={{
                            h2: ({ children }) => (
                                <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="font-semibold text-[#bb29ff] mt-3 mb-1.5">{children}</h3>
                            ),
                            p: ({ children }) => (
                                <p className="mb-2 leading-relaxed text-gray-300">{children}</p>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-[#bb29ff]">{children}</strong>
                            ),
                            code: ({ inline, children }) => inline ? (
                                <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-xs font-mono text-purple-300">
                                    {children}
                                </code>
                            ) : (
                                <code className="text-green-400">{children}</code>
                            ),
                            pre: ({ children }) => (
                                <pre className="bg-black/40 border border-white/5 text-green-400 p-4 rounded-xl text-xs overflow-x-auto my-3 leading-relaxed font-mono custom-scrollbar">
                                    {children}
                                </pre>
                            ),
                            ul: ({ children }) => (
                                <ul className="list-disc list-inside space-y-1 mb-2 text-sm text-gray-300">{children}</ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal list-inside space-y-1 mb-2 text-sm text-gray-300">{children}</ol>
                            ),
                            li: ({ children }) => (
                                <li className="text-gray-300">{children}</li>
                            ),
                            blockquote: ({ children }) => (
                                <div className="bg-[#bb29ff]/5 border-l-4 border-[#bb29ff]/40 rounded-r-xl px-4 py-3 my-3 text-sm text-gray-400 italic">
                                    {children}
                                </div>
                            ),
                            a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer"
                                   className="text-[#bb29ff] hover:underline">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}