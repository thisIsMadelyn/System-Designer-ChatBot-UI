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
import Chatwindow from "../components/Chatwindow.jsx";
import ImportantBox from "../components/ImportantBox";
import DotGrid from "../components/DotGrid";
import {
    Layout, MessageSquare, Terminal,
    Cpu, Zap, Activity, X,
} from "lucide-react";

const RIGHT_TABS = [
    { id: "result", label: "Design Result", icon: <Layout        size={16} /> },
    { id: "chat",   label: "AI Terminal",   icon: <MessageSquare size={16} /> },
];

const AGENT_STEPS = ["Analyst", "Architect", "Database", "Backend", "DevOps", "Testing"];

export default function ProjectDashboard() {
    const { projectId }              = useParams();
    const { projects, bumpDesignCount } = useProjectStore();
    const { initSession }            = useChatStore();

    const project   = projects.find((p) => String(p.id) === String(projectId));
    const sessionId = `session-${projectId}`;

    const {
        messages, loading, progress,
        sendMessage, submitDesignForm, cancelStream, clear,
    } = useChat(sessionId);

    const [rightTab,     setRightTab]     = useState("result");
    const [latestOutput, setLatestOutput] = useState(null);

    useEffect(() => {
        initSession(sessionId);
    }, [projectId]);

    const handleDesignSubmit = async (formData) => {
        setRightTab("result");
        setLatestOutput(null);

        const result = await submitDesignForm(projectId, formData);
        if (result?.structured_output) {
            setLatestOutput(result.structured_output);
            bumpDesignCount(projectId);
        }
    };

    // ── 404 ───────────────────────────────────────────────────
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

    const architectureSummary = latestOutput?.architect?.summary      ?? null;
    const projectSummary      = latestOutput?.system_analyst?.summary ?? null;

    return (
        <div className="h-screen flex flex-col bg-[#0f0a1a] text-white overflow-hidden relative">

            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <DotGrid baseColor="#2d233e" activeColor="#bb29ff" dotSize={1} gap={35} />
            </div>

            <Navbar title={project.name} subtitle="Architecture Node" />

            <div className="flex flex-1 overflow-hidden relative z-10 p-2 gap-2">

                {/* 1. SIDEBAR */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                {/* 2. DESIGN FORM */}
                <div className="w-80 bg-[#1a1425]/40 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 text-[#bb29ff]">
                            <Cpu size={18} />
                            <h2 className="text-xs font-bold uppercase tracking-widest">Input Parameters</h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar">
                        <DesignForm onSubmit={handleDesignSubmit} loading={loading} />
                    </div>
                </div>

                {/* 3. MAIN CONTENT */}
                <div className="flex-1 flex flex-col bg-[#1a1425]/20 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Tabs */}
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

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative">

                        {/* ── RESULT TAB ── */}
                        {rightTab === "result" && (
                            <div className="h-full overflow-y-auto px-8 py-8 custom-scrollbar">

                                {/* Empty state */}
                                {!latestOutput && !loading && (
                                    <div className="flex flex-col items-center justify-center h-full gap-6 text-center fade-up">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Ready to Architect</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                                                Initialize the agent pipeline using the parameters in the left panel.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {["Spring Boot", "MySQL", "Docker", "JUnit 5", "PlantUML", "Swagger"].map((t) => (
                                                <span key={t} className="bg-purple-500/10 border border-purple-500/20 text-[#bb29ff] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Progress bar */}
                                {loading && progress && (
                                    <div className="max-w-lg mx-auto mt-16 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <Activity className="text-[#bb29ff] animate-pulse" size={20} />
                                                <span className="text-sm font-bold uppercase tracking-widest text-white">
                                                    Running Agent Pipeline
                                                </span>
                                            </div>
                                            <button
                                                onClick={cancelStream}
                                                className="text-gray-600 hover:text-red-400 transition-colors"
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Agent name + % */}
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm text-[#bb29ff] font-bold">
                                                {progress.agent}
                                            </span>
                                            <span className="text-sm font-mono font-bold text-white">
                                                {progress.pct}%
                                            </span>
                                        </div>

                                        {/* Bar */}
                                        <div className="w-full bg-white/10 rounded-full h-2.5 mb-6 overflow-hidden">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-700 ease-out"
                                                style={{
                                                    width:      `${progress.pct}%`,
                                                    background: "linear-gradient(90deg, #7c3aed, #bb29ff)",
                                                    boxShadow:  "0 0 12px rgba(187,41,255,0.5)",
                                                }}
                                            />
                                        </div>

                                        {/* Step dots */}
                                        <div className="flex justify-between">
                                            {AGENT_STEPS.map((name, i) => {
                                                const stepPct  = ((i + 1) / 6) * 100;
                                                const isDone   = progress.pct >= stepPct;
                                                const isActive = progress.step === i + 1;
                                                return (
                                                    <div key={name} className="flex flex-col items-center gap-1.5">
                                                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500
                                                            ${isDone   ? "bg-[#bb29ff] shadow-[0_0_8px_rgba(187,41,255,0.8)]"
                                                            : isActive ? "bg-[#bb29ff] animate-ping"
                                                                :            "bg-white/10"}`}
                                                        />
                                                        <span className={`text-[9px] font-bold uppercase tracking-tight
                                                            ${isDone || isActive ? "text-[#bb29ff]" : "text-gray-600"}`}>
                                                            {name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Results */}
                                {latestOutput && !loading && (
                                    <div className="space-y-6 fade-up pb-10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <ImportantBox variant="architecture">
                                                <div className="flex items-center gap-2">
                                                    <Zap size={14} className="text-yellow-400" />
                                                    <span><strong>{architectureSummary ?? "Architecture"}</strong></span>
                                                </div>
                                            </ImportantBox>
                                            <ImportantBox variant="recommendation">
                                                {projectSummary ?? "Design complete"}
                                            </ImportantBox>
                                        </div>
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 shadow-inner backdrop-blur-sm">
                                            <StructuredOutput output={latestOutput} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── CHAT TAB ── */}
                        {rightTab === "chat" && (
                            <div className="h-full">
                                <Chatwindow
                                    messages={messages}
                                    loading={loading}
                                    onSend={sendMessage}
                                    onClear={clear}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. MARGIN NOTES */}
                <div className="hidden xl:block w-72">
                    <MarginNotes projectId={projectId} />
                </div>
            </div>
        </div>
    );
}