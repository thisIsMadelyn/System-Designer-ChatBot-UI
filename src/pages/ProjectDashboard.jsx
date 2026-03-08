import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { useChatStore } from "../store/chatStore";
import { useChat } from "../hooks/useChat";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DesignForm from "../components/DesignForm";
import StructuredOutput from "../components/StructuredOutput";
import MarginNotes from "../components/MarginNotes.jsx";
import ChatWindow from "../components/ChatWindow";
import ImportantBox from "../components/ImportantBox";

const RIGHT_TABS = [
    { id: "result", label: "📐 Design Result" },
    { id: "chat",   label: "💬 Chat" },
];

export default function ProjectDashboard() {
    const { projectId } = useParams();
    const { projects, bumpDesignCount } = useProjectStore();
    const { initSession } = useChatStore();
    const project = projects.find((p) => p.id === projectId);

    const sessionId = `session-${projectId}`;
    const { messages, loading, sendMessage, submitDesignForm, clear } = useChat(sessionId);

    const [rightTab,     setRightTab]     = useState("result");
    const [latestOutput, setLatestOutput] = useState(null);

    useEffect(() => { initSession(sessionId); }, [projectId]);

    const handleDesignSubmit = async (formData) => {
        setRightTab("result");
        const output = await submitDesignForm(formData);
        if (output) {
            setLatestOutput(output);
            bumpDesignCount(projectId);
        }
    };

    if (!project) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-serif text-xl text-espresso">Project not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-cream overflow-hidden">
            <Navbar title={project.name} subtitle="System Designer" />

            <div className="flex flex-1 overflow-hidden">
                {/* PROJECT SIDEBAR */}
                <Sidebar />

                {/* FORM PANEL */}
                <div className="w-72 border-r border-[rgba(193,123,63,0.12)] bg-white/50 flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-[rgba(193,123,63,0.08)]">
                        <h2 className="font-serif text-base font-bold text-espresso">Design Request</h2>
                        <p className="text-xs text-latte italic mt-0.5">Fill in the form to run the AI pipeline</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        <DesignForm onSubmit={handleDesignSubmit} loading={loading} />
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex gap-1 px-6 pt-4 border-b border-[rgba(193,123,63,0.1)]">
                        {RIGHT_TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setRightTab(t.id)}
                                className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px
                  ${rightTab === t.id
                                    ? "border-amber text-amber bg-white"
                                    : "border-transparent text-latte hover:text-mocha"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* RESULT TAB */}
                    {rightTab === "result" && (
                        <div className="flex-1 overflow-y-auto px-7 py-6">
                            {!latestOutput && !loading && (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-light to-[#FFE0B2] flex items-center justify-center text-3xl shadow-warm">🏛️</div>
                                    <div className="font-serif text-2xl font-bold text-espresso">Ready to Architect</div>
                                    <div className="text-sm text-latte italic max-w-sm leading-relaxed">
                                        Fill in the design form on the left and click "Generate System Design" to start the AI pipeline.
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                                        {["🔐 Spring Security JWT", "🗄️ MySQL Schema", "🐳 Docker Config", "📐 ERD Diagrams"].map((t) => (
                                            <span key={t} className="bg-amber-light border border-[rgba(193,123,63,0.2)] text-amber text-xs px-3 py-1.5 rounded-full font-medium">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {loading && (
                                <div className="bg-white border border-[rgba(193,123,63,0.1)] rounded-2xl p-5 shadow-warm">
                                    <p className="text-sm text-latte mb-3">Running agent pipeline...</p>
                                    <div className="space-y-2">
                                        {["Requirements Analyzer", "Architecture Designer", "Database Modeler", "API Designer"].map((a, i) => (
                                            <div key={a} className="flex items-center gap-3 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-amber dot-pulse" style={{ animationDelay: `${i * 300}ms` }} />
                                                <span className="text-mocha">{a}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {latestOutput && !loading && (
                                <div className="space-y-4 fade-up">
                                    <ImportantBox variant="architecture">
                                        <strong>{latestOutput.architecture?.architecture_style}</strong> chosen for this project. See Architecture tab for full tradeoff analysis.
                                    </ImportantBox>
                                    <ImportantBox variant="recommendation">
                                        {latestOutput.requirements?.summary}
                                    </ImportantBox>
                                    <div className="bg-white border border-[rgba(193,123,63,0.1)] rounded-2xl p-5 shadow-warm">
                                        <StructuredOutput output={latestOutput} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CHAT TAB */}
                    {rightTab === "chat" && (
                        <div className="flex-1 overflow-hidden">
                            <ChatWindow messages={messages} loading={loading} onSend={sendMessage} onClear={clear} />
                        </div>
                    )}
                </div>

                {/* ── MARGIN NOTES PANEL (right edge) ── */}
                <MarginNotes projectId={projectId} />
            </div>
        </div>
    );
}