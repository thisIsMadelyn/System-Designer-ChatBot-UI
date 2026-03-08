import { useState } from "react";
import ImportantBox from "./ImportantBox";

const TABS = [
    { id: "requirements", label: "📋 Requirements", agent: "Agent 1" },
    { id: "architecture", label: "🏛️ Architecture", agent: "Agent 2" },
    { id: "database",     label: "🗄️ Database",     agent: "Agent 3" },
    { id: "api",          label: "🔌 API & Auth",    agent: "Agent 4" },
];

function Chip({ children, variant = "default" }) {
    const cls = {
        default:  "bg-amber-light border border-[rgba(193,123,63,0.2)] text-mocha",
        pro:      "bg-green-50 border border-green-200 text-green-700",
        con:      "bg-red-50 border border-red-200 text-red-700",
        entity:   "bg-amber-light border border-amber-border text-amber",
        endpoint: "bg-blue-50 border border-blue-200 text-blue-700",
    }[variant];
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>{children}</span>;
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
            className="text-xs text-latte hover:text-amber transition-colors border border-[rgba(193,123,63,0.2)] px-3 py-1.5 rounded-xl hover:border-amber"
        >
            ⬇ Export JSON
        </button>
    );
}

export default function StructuredOutput({ output }) {
    const [tab, setTab] = useState("requirements");
    if (!output) return null;

    const { requirements, architecture, database, api_design } = output;

    return (
        <div className="fade-up">
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap mb-4">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border
              ${tab === t.id
                            ? "bg-amber text-white border-amber shadow-warm"
                            : "bg-transparent text-latte border-[rgba(193,123,63,0.2)] hover:text-amber hover:border-amber"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
                <div className="ml-auto">
                    <ExportButton data={output} filename="system-design.json" />
                </div>
            </div>

            {/* REQUIREMENTS */}
            {tab === "requirements" && requirements && (
                <div className="space-y-4">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">Functional</div>
                        <div className="flex flex-wrap gap-2">
                            {requirements.functional_requirements.map((r, i) => <Chip key={i}>{r}</Chip>)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">Non-Functional</div>
                        <div className="flex flex-wrap gap-2">
                            {requirements.non_functional_requirements.map((r, i) => <Chip key={i} variant="pro">{r}</Chip>)}
                        </div>
                    </div>
                    <ImportantBox variant="recommendation" title="Scale Estimation">
                        {requirements.scale_estimation}
                    </ImportantBox>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">Constraints</div>
                        <div className="flex flex-wrap gap-2">
                            {requirements.constraints.map((c, i) => <Chip key={i} variant="con">{c}</Chip>)}
                        </div>
                    </div>
                </div>
            )}

            {/* ARCHITECTURE */}
            {tab === "architecture" && architecture && (
                <div className="space-y-4">
                    <ImportantBox variant="architecture">
                        <span className="text-lg font-bold">{architecture.architecture_style}</span>
                    </ImportantBox>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">Services / Modules</div>
                        <div className="space-y-2">
                            {architecture.services.map((s, i) => (
                                <div key={i} className="bg-amber-light/60 rounded-xl px-4 py-2.5 text-sm">
                                    <span className="font-semibold text-amber-dark">{s.name}</span>
                                    <span className="text-latte"> — {s.responsibility}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">Tradeoffs</div>
                        <div className="flex flex-wrap gap-2">
                            {architecture.tradeoffs.map((t, i) => (
                                <Chip key={i} variant={t.startsWith("Pro") ? "pro" : "con"}>{t}</Chip>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* DATABASE */}
            {tab === "database" && database && (
                <div className="space-y-4">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">Entities</div>
                        <div className="flex flex-wrap gap-2">
                            {database.entities.map((e, i) => <Chip key={i} variant="entity">📦 {e.name}</Chip>)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-2">MySQL Schema</div>
                        <pre className="bg-espresso text-[#F5DEB3] p-4 rounded-xl text-xs overflow-x-auto leading-relaxed font-mono">
              {database.mysql_schema_sql}
            </pre>
                    </div>
                </div>
            )}

            {/* API */}
            {tab === "api" && api_design && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        {api_design.endpoints.map((ep, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(193,123,63,0.08)]">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg min-w-[46px] text-center
                  ${ep.method === "GET" ? "bg-blue-50 text-blue-700" : "bg-amber-light text-amber"}`}>
                  {ep.method}
                </span>
                                <code className="text-sm flex-1 font-mono text-espresso">{ep.path}</code>
                                {ep.auth_required
                                    ? <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg">🔐 {ep.roles?.join(", ")}</span>
                                    : <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-lg">🌐 public</span>
                                }
                            </div>
                        ))}
                    </div>
                    <ImportantBox variant="constraint" title="Spring Security Config">
                        <pre className="text-xs whitespace-pre-wrap font-mono">{api_design.spring_security_config}</pre>
                    </ImportantBox>
                </div>
            )}
        </div>
    );
}