import ReactMarkdown from "react-markdown";
import ImportantBox from "./ImportantBox";

// Detects special markers in markdown and renders ImportantBox
function parseMarkers(content) {
    const lines = content.split("\n");
    const blocks = [];
    let current = [];

    for (const line of lines) {
        if (line.startsWith(":::architecture")) {
            if (current.length) { blocks.push({ type: "text", content: current.join("\n") }); current = []; }
            blocks.push({ type: "architecture", content: "" });
        } else if (line.startsWith(":::constraint")) {
            if (current.length) { blocks.push({ type: "text", content: current.join("\n") }); current = []; }
            blocks.push({ type: "constraint", content: "" });
        } else if (line.startsWith(":::recommendation")) {
            if (current.length) { blocks.push({ type: "text", content: current.join("\n") }); current = []; }
            blocks.push({ type: "recommendation", content: "" });
        } else if (line === ":::") {
            // close block — handled by tracking last open block
        } else {
            if (blocks.length && ["architecture","constraint","recommendation"].includes(blocks[blocks.length-1].type) && blocks[blocks.length-1].content === "") {
                blocks[blocks.length-1].content += (blocks[blocks.length-1].content ? "\n" : "") + line;
            } else {
                current.push(line);
            }
        }
    }
    if (current.length) blocks.push({ type: "text", content: current.join("\n") });
    return blocks;
}

export default function MessageBubble({ message }) {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex justify-end mb-6 fade-up">
                <div className="max-w-[75%]">
                    <div className="text-xs text-latte text-right mb-1.5 pr-1">You</div>
                    <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFF3E4] border border-[rgba(193,123,63,0.15)] rounded-[18px] rounded-tr-sm px-5 py-3.5 text-sm leading-relaxed text-espresso">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 mb-6 fade-up">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center text-sm flex-shrink-0 mt-1 shadow-warm">
                🤖
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs text-latte mb-1.5">System Designer</div>
                <div className="bg-white border border-[rgba(193,123,63,0.1)] rounded-[18px] rounded-tl-sm px-5 py-4 text-sm leading-relaxed shadow-warm">
                    <ReactMarkdown
                        components={{
                            h2: ({ children }) => <h2 className="font-serif text-lg font-bold text-espresso mt-4 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="font-semibold text-mocha mt-3 mb-1.5">{children}</h3>,
                            p:  ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-amber-dark">{children}</strong>,
                            code: ({ children }) => <code className="bg-cream px-1.5 py-0.5 rounded-md text-xs font-mono text-mocha">{children}</code>,
                            pre: ({ children }) => <pre className="bg-espresso text-[#F5DEB3] p-4 rounded-xl text-xs overflow-x-auto my-3 leading-relaxed font-mono">{children}</pre>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-sm">{children}</ul>,
                            li: ({ children }) => <li className="text-mocha">{children}</li>,
                            blockquote: ({ children }) => (
                                <div className="bg-amber-light border-l-4 border-amber-border rounded-r-xl px-4 py-3 my-3 text-sm text-mocha italic">
                                    {children}
                                </div>
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