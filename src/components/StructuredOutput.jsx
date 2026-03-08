import { useState } from "react";
import ImportantBox from "./ImportantBox";
import { Download, Database, Layout, ShieldCheck, ListChecks, Server, Globe, Lock } from "lucide-react";

const TABS = [
    { id: "requirements", label: "Requirements", icon: <ListChecks size={14} /> },
    { id: "architecture", label: "Architecture", icon: <Server size={14} /> },
    { id: "database",     label: "Database",     icon: <Database size={14} /> },
    { id: "api",          label: "API & Auth",    icon: <Globe size={14} /> },
];

function Chip({ children, variant = "default" }) {
    const cls = {
        default:  "bg-white/5 border-white/10 text-gray-300",
        pro:      "bg-green-500/10 border-green-500/20 text-green-400",
        con:      "bg-red-500/10 border-red-500/20 text-red-400",
        entity:   "bg-[#bb29ff]/10 border-[#bb29ff]/20 text-[#bb29ff]",
        endpoint: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    }[variant];
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>{children}</span>;
}

function ExportButton({ data, filename }) {
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    };
    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] transition-all border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5"
        >
            <Download size={14} /> Export JSON
        </button>
    );
}

export default function StructuredOutput({ output }) {
    const [tab, setTab] = useState("requirements");
    if (!output) return null;

    const { requirements, architecture, database, api_design } = output;

    const sectionLabelCls = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 flex items-center gap-2";

    return (
        <div className="fade-up">
            {/* Tabs Navigation */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                ${tab === t.id
                                ? "bg-[#bb29ff] text-white shadow-[0_0_15px_rgba(187,41,255,0.3)]"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {t.icon} <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>
                <ExportButton data={output} filename="system-design.json" />
            </div>

            {/* REQUIREMENTS TAB */}
            {tab === "requirements" && requirements && (
                <div className="space-y-8">
                    <div>
                        <div className={sectionLabelCls}><div className="w-1 h-1 bg-purple-500 rounded-full" /> Functional</div>
                        <div className="flex flex-wrap gap-2">
                            {requirements.functional_requirements.map((r, i) => <Chip key={i}>{r}</Chip>)}
                        </div>
                    </div>
                    <div>
                        <div className={sectionLabelCls}><div className="w-1 h-1 bg-green-500 rounded-full" /> Non-Functional</div>
                        <div className="flex flex-wrap gap-2">
                            {requirements.non_functional_requirements.map((r, i) => <Chip key={i} variant="pro">{r}</Chip>)}
                        </div>
                    </div>
                    <ImportantBox variant="recommendation" title="Capacity Planning">
                        <div className="font-mono text-sm">{requirements.scale_estimation}</div>
                    </ImportantBox>
                </div>
            )}

            {/* ARCHITECTURE TAB */}
            {tab === "architecture" && architecture && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
                        <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Architecture Pattern</div>
                        <div className="text-2xl font-bold text-white">{architecture.architecture_style}</div>
                    </div>
                    <div>
                        <div className={sectionLabelCls}>Module Definitions</div>
                        <div className="grid gap-3">
                            {architecture.services.map((s, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl px-5 py-4 hover:border-white/10 transition-colors">
                                    <div className="text-sm font-bold text-[#bb29ff] mb-1">{s.name}</div>
                                    <div className="text-xs text-gray-400 leading-relaxed">{s.responsibility}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* DATABASE TAB */}
            {tab === "database" && database && (
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {database.entities.map((e, i) => <Chip key={i} variant="entity">{e.name}</Chip>)}
                    </div>
                    <div className="relative group">
                        <div className={sectionLabelCls}>SQL Schema Definition</div>
                        <pre className="bg-black/40 border border-white/5 text-green-400 p-6 rounded-2xl text-xs overflow-x-auto leading-relaxed font-mono custom-scrollbar shadow-inner">
                            {database.mysql_schema_sql}
                        </pre>
                        <div className="absolute top-12 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Database size={24} />
                        </div>
                    </div>
                </div>
            )}

            {/* API TAB */}
            {tab === "api" && api_design && (
                <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                        {api_design.endpoints.map((ep, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg min-w-[55px] text-center border
                                    ${ep.method === "GET" ? "border-blue-500/30 text-blue-400 bg-blue-500/5" : "border-purple-500/30 text-purple-400 bg-purple-500/5"}`}>
                                    {ep.method}
                                </span>
                                <code className="text-sm font-mono text-gray-300 flex-1">{ep.path}</code>
                                {ep.auth_required ? (
                                    <div className="flex items-center gap-1.5 text-purple-400 text-[10px] font-bold uppercase tracking-tighter">
                                        <Lock size={12} /> {ep.roles?.join(", ")}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-gray-600 text-[10px] font-bold uppercase tracking-tighter">
                                        <Globe size={12} /> Public
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <div className={sectionLabelCls}><ShieldCheck size={14} /> Security Config Template</div>
                        <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap leading-relaxed">
                            {api_design.spring_security_config}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}