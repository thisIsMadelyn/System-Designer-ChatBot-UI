//---------------------------------------------------------------------
// frontend/src/components/StructuredOutput.jsx
//
// 6 tabs αντιστοιχούν στα 6 agent outputs:
//   analyst   → system_analyst
//   architect → architect
//   database  → database
//   backend   → backend_layer
//   devops    → devops
//   testing   → testing

import { useState } from "react";
import {
    Download, Database, Layout, Server, Globe,
    FlaskConical, Container, TestTube, ChevronRight,
} from "lucide-react";

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
    { id: "system_analyst", label: "Analysis",    icon: <Layout      size={14} /> },
    { id: "architect",      label: "Architecture",icon: <Server      size={14} /> },
    { id: "database",       label: "Database",    icon: <Database    size={14} /> },
    { id: "backend_layer",  label: "Backend",     icon: <Globe       size={14} /> },
    { id: "devops",         label: "DevOps",      icon: <Container   size={14} /> },
    { id: "testing",        label: "Testing",     icon: <TestTube    size={14} /> },
];

// ── Reusable sub-components ───────────────────────────────────────────────────

function Chip({ children, variant = "default" }) {
    const cls = {
        default:  "bg-white/5 border-white/10 text-gray-300",
        pro:      "bg-green-500/10 border-green-500/20 text-green-400",
        entity:   "bg-[#bb29ff]/10 border-[#bb29ff]/20 text-[#bb29ff]",
        method:   "bg-blue-500/10 border-blue-500/20 text-blue-400",
        warning:  "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        error:    "bg-red-500/10 border-red-500/20 text-red-400",
    }[variant] ?? "bg-white/5 border-white/10 text-gray-300";
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
            {children}
        </span>
    );
}

function SectionLabel({ children }) {
    return (
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-purple-500 rounded-full" />
            {children}
        </div>
    );
}

// Block για code / preformatted text
function CodeBlock({ children, lang = "" }) {
    return (
        <pre className="bg-black/40 border border-white/5 text-green-400 p-5 rounded-2xl text-xs overflow-x-auto leading-relaxed font-mono custom-scrollbar shadow-inner whitespace-pre-wrap">
            {children}
        </pre>
    );
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

// ── Tab Panels ────────────────────────────────────────────────────────────────

// Tab 1: System Analyst
// Fields: summary, requirements[], tech_stack{}, agent_plan[]
function AnalystPanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            {/* Summary */}
            <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
                <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Project Summary</div>
                <div className="text-base text-white leading-relaxed">{data.summary}</div>
            </div>

            {/* Requirements */}
            <div>
                <SectionLabel>Requirements</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {data.requirements?.map((r, i) => <Chip key={i}>{r}</Chip>)}
                </div>
            </div>

            {/* Tech Stack */}
            <div>
                <SectionLabel>Tech Stack</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    {data.tech_stack && Object.entries(data.tech_stack).map(([k, v]) => (
                        <div key={k} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{k}</div>
                            <div className="text-sm text-[#bb29ff] font-bold">{v}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Agent Plan */}
            <div>
                <SectionLabel>Agent Execution Plan</SectionLabel>
                <div className="flex items-center flex-wrap gap-2">
                    {data.agent_plan?.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Chip variant="pro">{i + 1}. {step}</Chip>
                            {i < data.agent_plan.length - 1 && <ChevronRight size={12} className="text-gray-600" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Tab 2: Architect
// Fields: summary, package_structure, design_patterns[], uml_class, uml_sequence, tech_versions{}
function ArchitectPanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
                <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Architecture Style</div>
                <div className="text-2xl font-bold text-white">{data.summary}</div>
            </div>

            {/* Design Patterns */}
            <div>
                <SectionLabel>Design Patterns</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {data.design_patterns?.map((p, i) => <Chip key={i} variant="entity">{p}</Chip>)}
                </div>
            </div>

            {/* Package Structure */}
            <div>
                <SectionLabel>Package Structure</SectionLabel>
                <CodeBlock>{data.package_structure}</CodeBlock>
            </div>

            {/* UML Class */}
            {data.uml_class && (
                <div>
                    <SectionLabel>UML Class Diagram (PlantUML)</SectionLabel>
                    <CodeBlock>{data.uml_class}</CodeBlock>
                </div>
            )}

            {/* UML Sequence */}
            {data.uml_sequence && (
                <div>
                    <SectionLabel>UML Sequence Diagram (PlantUML)</SectionLabel>
                    <CodeBlock>{data.uml_sequence}</CodeBlock>
                </div>
            )}

            {/* Tech Versions */}
            <div>
                <SectionLabel>Technology Versions</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    {data.tech_versions && Object.entries(data.tech_versions).map(([k, v]) => (
                        <div key={k} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{k}</div>
                            <div className="text-sm text-green-400 font-mono font-bold">{v}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Tab 3: Database Agent
// Fields: summary, entities[], relationships[], java_code, application_properties
function DatabasePanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            {/* Entities */}
            <div>
                <SectionLabel>JPA Entities</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {data.entities?.map((e, i) => (
                        <Chip key={i} variant="entity">{e.name} → {e.table}</Chip>
                    ))}
                </div>
            </div>

            {/* Relationships */}
            {data.relationships?.length > 0 && (
                <div>
                    <SectionLabel>Relationships</SectionLabel>
                    <div className="space-y-2">
                        {data.relationships.map((r, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono">
                                {r}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Java Code */}
            <div>
                <SectionLabel>Java Entity Code</SectionLabel>
                <CodeBlock>{data.java_code}</CodeBlock>
            </div>

            {/* application.properties */}
            <div>
                <SectionLabel>application.properties</SectionLabel>
                <CodeBlock>{data.application_properties}</CodeBlock>
            </div>
        </div>
    );
}

// Tab 4: Backend Layer
// Fields: summary, dto_code, service_code, exception_code, controller_code, swagger_config
function BackendPanel({ data }) {
    const [activeCode, setActiveCode] = useState("controller_code");

    if (!data) return null;

    // Tabs μέσα στο tab για τα διάφορα αρχεία κώδικα
    const codeTabs = [
        { id: "controller_code", label: "Controllers" },
        { id: "service_code",    label: "Services"    },
        { id: "dto_code",        label: "DTOs"        },
        { id: "exception_code",  label: "Exceptions"  },
        { id: "swagger_config",  label: "Swagger"     },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-6 rounded-3xl border border-blue-500/20">
                <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Backend Layer</div>
                <div className="text-base text-white">{data.summary}</div>
            </div>

            {/* Inner code tabs */}
            <div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-4 flex-wrap gap-1">
                    {codeTabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveCode(t.id)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                                ${activeCode === t.id
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <CodeBlock>{data[activeCode] || "// No output for this section"}</CodeBlock>
            </div>
        </div>
    );
}

// Tab 5: DevOps
// Fields: summary, dockerfile, docker_compose, dockerignore, readme
function DevOpsPanel({ data }) {
    const [activeFile, setActiveFile] = useState("dockerfile");

    if (!data) return null;

    const files = [
        { id: "dockerfile",     label: "Dockerfile"       },
        { id: "docker_compose", label: "docker-compose"   },
        { id: "dockerignore",   label: ".dockerignore"    },
        { id: "readme",         label: "README.md"        },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500/10 to-transparent p-6 rounded-3xl border border-green-500/20">
                <div className="text-[10px] font-bold text-green-400 uppercase mb-1">DevOps Configuration</div>
                <div className="text-base text-white">{data.summary}</div>
            </div>

            <div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-4 flex-wrap gap-1">
                    {files.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFile(f.id)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                                ${activeFile === f.id
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <CodeBlock>{data[activeFile] || "# No output for this file"}</CodeBlock>
            </div>
        </div>
    );
}

// Tab 6: Testing
// Fields: summary, unit_tests, test_report, errors[], coverage_estimate
function TestingPanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            {/* Coverage + Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-3xl border border-yellow-500/20">
                    <div className="text-[10px] font-bold text-yellow-400 uppercase mb-1">Coverage Estimate</div>
                    <div className="text-3xl font-black text-white">{data.coverage_estimate}</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Summary</div>
                    <div className="text-sm text-gray-300 leading-relaxed">{data.summary}</div>
                </div>
            </div>

            {/* Errors */}
            {data.errors?.length > 0 && (
                <div>
                    <SectionLabel>Errors / Warnings</SectionLabel>
                    <div className="space-y-2">
                        {data.errors.map((e, i) => (
                            <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
                                {e}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Test Report */}
            <div>
                <SectionLabel>Test Report</SectionLabel>
                <CodeBlock>{data.test_report}</CodeBlock>
            </div>

            {/* Unit Tests Code */}
            <div>
                <SectionLabel>Unit Tests (JUnit 5)</SectionLabel>
                <CodeBlock>{data.unit_tests}</CodeBlock>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function StructuredOutput({ output }) {
    const [tab, setTab] = useState("system_analyst");

    // output είναι το structured_output dict από το backend
    // Αναμένουμε: { system_analyst, architect, database, backend_layer, devops, testing }
    if (!output) return null;

    return (
        <div className="fade-up">
            {/* Top bar: tabs + export */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 flex-wrap gap-1">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                ${tab === t.id
                                ? "bg-[#bb29ff] text-white shadow-[0_0_15px_rgba(187,41,255,0.3)]"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                        >
                            {t.icon}
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>
                <ExportButton data={output} filename="microservice-design.json" />
            </div>

            {/* Panel rendering */}
            {tab === "system_analyst" && <AnalystPanel   data={output.system_analyst} />}
            {tab === "architect"      && <ArchitectPanel data={output.architect}      />}
            {tab === "database"       && <DatabasePanel  data={output.database}       />}
            {tab === "backend_layer"  && <BackendPanel   data={output.backend_layer}  />}
            {tab === "devops"         && <DevOpsPanel    data={output.devops}         />}
            {tab === "testing"        && <TestingPanel   data={output.testing}        />}
        </div>
    );
}