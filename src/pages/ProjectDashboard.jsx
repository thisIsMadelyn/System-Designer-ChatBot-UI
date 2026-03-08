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
import DotGrid from "../components/DotGrid";
import { Layout, MessageSquare, Terminal, Cpu, Zap, Activity } from "lucide-react";

const RIGHT_TABS = [
    { id: "result", label: "Design Result", icon: <Layout size={16} /> },
    { id: "chat",   label: "AI Terminal",   icon: <MessageSquare size={16} /> },
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
            <div className="min-h-screen bg-[#0f0a1a] flex items-center justify-center text-white font-mono">
                <div className="text-center animate-pulse">
                    <Terminal size={48} className="mx-auto mb-4 text-[#bb29ff]" />
                    <p className="text-xl">404_PROJECT_NOT_FOUND</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#0f0a1a] text-white overflow-hidden relative">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 opacity-30">
                <DotGrid baseColor="#2d233e" activeColor="#bb29ff" dotSize={1} gap={35} />
            </div>

            <Navbar title={project.name} subtitle="Architecture Node" />

            <div className="flex flex-1 overflow-hidden relative z-10 p-2 gap-2">

                {/* 1. LEFT SIDEBAR (Navigation) */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                {/* 2. DESIGN FORM PANEL (Left Margin) */}
                <div className="w-80 bg-[#1a1425]/40 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 text-[#bb29ff] mb-1">
                            <Cpu size={18} />
                            <h2 className="text-xs font-bold uppercase tracking-widest">Input Parameters</h2>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Configure AI Generation</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
                        <DesignForm onSubmit={handleDesignSubmit} loading={loading} />
                    </div>
                </div>

                {/* 3. MAIN CONTENT (Center) */}
                <div className="flex-1 flex flex-col bg-[#1a1425]/20 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Modern Tabs */}
                    <div className="flex gap-4 px-6 pt-4 border-b border-white/5 bg-white/5">
                        {RIGHT_TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setRightTab(t.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px
                                    ${rightTab === t.id
                                    ? "border-[#bb29ff] text-[#bb29ff] bg-[#bb29ff]/5"
                                    : "border-transparent text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 overflow-hidden relative">
                        {rightTab === "result" && (
                            <div className="h-full overflow-y-auto px-8 py-8 custom-scrollbar">
                                {!latestOutput && !loading && (
                                    <div className="flex flex-col items-center justify-center h-full gap-6 text-center fade-up">
                                        <div className="relative">

                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Ready to Architect</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                                                Initialize the agent pipeline using the parameters in the left panel.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {["Spring JWT", "MySQL", "Docker", "Mermaid ERD"].map((t) => (
                                                <span key={t} className="bg-purple-500/10 border border-purple-500/20 text-[#bb29ff] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {loading && (
                                    <div className="max-w-md mx-auto mt-20 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Activity className="text-[#bb29ff] animate-pulse" />
                                            <span className="text-sm font-bold uppercase tracking-widest">Processing Node Logic...</span>
                                        </div>
                                        <div className="space-y-4">
                                            {["Requirements Analyzer", "Architecture Designer", "Database Modeler", "API Designer"].map((a, i) => (
                                                <div key={a} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#bb29ff] animate-ping' : 'bg-gray-700'}`} />
                                                        <span className={`text-sm ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{a}</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-gray-600">{i === 0 ? "EXECUTING..." : "PENDING"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {latestOutput && !loading && (
                                    <div className="space-y-6 fade-up pb-10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <ImportantBox variant="architecture">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={14} className="text-yellow-400" />
                                                    <span><strong>{latestOutput.architecture?.architecture_style}</strong> Pattern Detected</span>
                                                </div>
                                            </ImportantBox>
                                            <ImportantBox variant="recommendation">
                                                {latestOutput.requirements?.summary}
                                            </ImportantBox>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-inner backdrop-blur-sm">
                                            <StructuredOutput output={latestOutput} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {rightTab === "chat" && (
                            <div className="h-full">
                                <ChatWindow messages={messages} loading={loading} onSend={sendMessage} onClear={clear} />
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. MARGIN NOTES PANEL (Right Margin) */}
                <div className="hidden xl:block w-72">
                    <MarginNotes projectId={projectId} />
                </div>
            </div>
        </div>
    );
}