// frontend/src/components/StructuredOutput.jsx
// Προσθήκες:
//   - PlantUML rendering μέσω plantuml.com public API
//   - Syntax highlighting μέσω highlight.js με purple theme
//   - Fallback σε plain text αν το PlantUML αποτύχει

import { useState, useEffect, useRef } from "react";
import {
    Download, Database, Server, Globe,
    Container, TestTube, Layout, ChevronRight, ImageOff,
} from "lucide-react";

// ── highlight.js lazy loader ──────────────────────────────────────────────────
// Φορτώνουμε highlight.js μόνο όταν χρειαστεί (code block)
let hljs = null;
async function getHljs() {
    if (hljs) return hljs;
    const mod = await import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js");
    hljs = mod.default;
    // Φόρτωσε Java, XML, YAML, properties
    const [java, yaml, xml] = await Promise.all([
        import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/languages/java.min.js"),
        import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/languages/yaml.min.js"),
        import("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/languages/xml.min.js"),
    ]);
    hljs.registerLanguage("java",  java.default);
    hljs.registerLanguage("yaml",  yaml.default);
    hljs.registerLanguage("xml",   xml.default);
    return hljs;
}

// ── PlantUML encoder ──────────────────────────────────────────────────────────
// Μετατρέπει PlantUML text σε URL για το public plantuml.com server
function encodePlantUML(text) {
    // deflate + base64 encoding που περιμένει το plantuml.com
    function encode64(data) {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
        let r = "";
        for (let i = 0; i < data.length; i += 3) {
            const b0 = data[i], b1 = data[i+1] ?? 0, b2 = data[i+2] ?? 0;
            r += chars[b0 >> 2];
            r += chars[((b0 & 3) << 4) | (b1 >> 4)];
            r += chars[((b1 & 0xf) << 2) | (b2 >> 6)];
            r += chars[b2 & 0x3f];
        }
        return r;
    }

    try {
        const data    = new TextEncoder().encode(text);
        const deflated = pako_deflate(data); // χρησιμοποιούμε pako αν υπάρχει
        return encode64(deflated);
    } catch {
        // Fallback: απλό encoding χωρίς deflate (λειτουργεί για μικρά diagrams)
        const data = new TextEncoder().encode(text);
        return encode64(data);
    }
}

// Φόρτωσε pako για deflate compression (απαραίτητο για PlantUML encoding)
let pako = null;
async function getPako() {
    if (pako) return pako;
    const mod = await import("https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js");
    pako = mod.default ?? mod;
    return pako;
}

// Global function για να τη χρησιμοποιεί το encodePlantUML
function pako_deflate(data) {
    if (!pako) throw new Error("pako not loaded");
    return pako.deflateRaw(data, { level: 9 });
}

// ── PlantUML Image component ──────────────────────────────────────────────────
function PlantUMLDiagram({ code }) {
    const [imgUrl,   setImgUrl]   = useState(null);
    const [failed,   setFailed]   = useState(false);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        if (!code?.trim()) { setLoading(false); return; }

        let cancelled = false;
        (async () => {
            try {
                await getPako(); // βεβαιώσου ότι το pako είναι loaded
                const encoded = encodePlantUML(code.trim());
                const url     = `https://www.plantuml.com/plantuml/svg/${encoded}`;
                if (!cancelled) {
                    setImgUrl(url);
                    setLoading(false);
                }
            } catch {
                if (!cancelled) {
                    setFailed(true);
                    setLoading(false);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [code]);

    // Loading
    if (loading) return (
        <div className="flex items-center justify-center h-32 bg-black/20 rounded-2xl border border-white/5">
            <div className="w-6 h-6 border-2 border-[#bb29ff]/30 border-t-[#bb29ff] rounded-full animate-spin" />
        </div>
    );

    // Fallback — plain text
    if (failed || !imgUrl) return (
        <div>
            <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase mb-2">
                <ImageOff size={12} /> Diagram unavailable — showing source
            </div>
            <pre className="bg-black/40 border border-white/5 text-green-400 p-5 rounded-2xl text-xs overflow-x-auto font-mono whitespace-pre-wrap">
                {code}
            </pre>
        </div>
    );

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 overflow-x-auto">
            <img
                src={imgUrl}
                alt="UML Diagram"
                className="max-w-full mx-auto rounded-xl"
                onError={() => setFailed(true)}
                style={{ filter: "invert(1) hue-rotate(200deg) brightness(0.9)" }} // dark mode για το SVG
            />
        </div>
    );
}

// ── Syntax highlighted code block ─────────────────────────────────────────────
function CodeBlock({ children, language = "java" }) {
    const ref  = useRef(null);
    const [highlighted, setHighlighted] = useState(false);

    useEffect(() => {
        if (!children || highlighted) return;
        let cancelled = false;

        (async () => {
            try {
                const hl     = await getHljs();
                const result = hl.highlight(children, { language, ignoreIllegals: true });
                if (!cancelled && ref.current) {
                    ref.current.innerHTML = result.value;
                    setHighlighted(true);
                }
            } catch {
                // fallback: plain text — ref.current already has the text
            }
        })();
        return () => { cancelled = true; };
    }, [children, language]);

    return (
        <>
            {/* Inject purple highlight.js theme inline */}
            <style>{`
                .hljs-keyword, .hljs-selector-tag { color: #c792ea; font-weight: bold; }
                .hljs-string, .hljs-attr          { color: #c3e88d; }
                .hljs-number, .hljs-literal       { color: #f78c6c; }
                .hljs-comment                     { color: #546e7a; font-style: italic; }
                .hljs-class .hljs-title,
                .hljs-title                       { color: #bb29ff; font-weight: bold; }
                .hljs-type, .hljs-built_in        { color: #82aaff; }
                .hljs-meta, .hljs-annotation      { color: #ffcb6b; }
                .hljs-variable                    { color: #eeffff; }
                .hljs-params                      { color: #89ddff; }
                .hljs-doctag                      { color: #546e7a; }
            `}</style>
            <pre className="bg-black/40 border border-white/5 p-5 rounded-2xl text-xs overflow-x-auto leading-relaxed font-mono custom-scrollbar shadow-inner">
                <code ref={ref} className={`language-${language} text-gray-300`}>
                    {children}
                </code>
            </pre>
        </>
    );
}

// ── Reusable UI components ────────────────────────────────────────────────────
const TABS = [
    { id: "system_analyst", label: "Analysis",     icon: <Layout    size={14} /> },
    { id: "architect",      label: "Architecture", icon: <Server    size={14} /> },
    { id: "database",       label: "Database",     icon: <Database  size={14} /> },
    { id: "backend_layer",  label: "Backend",      icon: <Globe     size={14} /> },
    { id: "devops",         label: "DevOps",       icon: <Container size={14} /> },
    { id: "testing",        label: "Testing",      icon: <TestTube  size={14} /> },
];

function Chip({ children, variant = "default" }) {
    const cls = {
        default: "bg-white/5 border-white/10 text-gray-300",
        pro:     "bg-green-500/10 border-green-500/20 text-green-400",
        entity:  "bg-[#bb29ff]/10 border-[#bb29ff]/20 text-[#bb29ff]",
    }[variant] ?? "bg-white/5 border-white/10 text-gray-300";
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>{children}</span>;
}

function SectionLabel({ children }) {
    return (
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-purple-500 rounded-full" />{children}
        </div>
    );
}

function ExportButton({ data, filename }) {
    return (
        <button
            onClick={() => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement("a");
                a.href = url; a.download = filename; a.click();
                URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] transition-all border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5"
        >
            <Download size={14} /> Export JSON
        </button>
    );
}

// ── Tab Panels ────────────────────────────────────────────────────────────────

function AnalystPanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
                <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Project Summary</div>
                <div className="text-base text-white leading-relaxed">{data.summary}</div>
            </div>
            <div>
                <SectionLabel>Requirements</SectionLabel>
                <div className="flex flex-wrap gap-2">{data.requirements?.map((r, i) => <Chip key={i}>{r}</Chip>)}</div>
            </div>
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

function ArchitectPanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
                <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Architecture Style</div>
                <div className="text-2xl font-bold text-white">{data.summary}</div>
            </div>
            <div>
                <SectionLabel>Design Patterns</SectionLabel>
                <div className="flex flex-wrap gap-2">{data.design_patterns?.map((p, i) => <Chip key={i} variant="entity">{p}</Chip>)}</div>
            </div>
            <div>
                <SectionLabel>Package Structure</SectionLabel>
                <CodeBlock language="yaml">{data.package_structure}</CodeBlock>
            </div>
            {/* PlantUML rendering */}
            {data.uml_class && (
                <div>
                    <SectionLabel>UML Class Diagram</SectionLabel>
                    <PlantUMLDiagram code={data.uml_class} />
                </div>
            )}
            {data.uml_sequence && (
                <div>
                    <SectionLabel>UML Sequence Diagram</SectionLabel>
                    <PlantUMLDiagram code={data.uml_sequence} />
                </div>
            )}
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

function DatabasePanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
            <div>
                <SectionLabel>JPA Entities</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {data.entities?.map((e, i) => <Chip key={i} variant="entity">{e.name} → {e.table}</Chip>)}
                </div>
            </div>
            {data.relationships?.length > 0 && (
                <div>
                    <SectionLabel>Relationships</SectionLabel>
                    <div className="space-y-2">
                        {data.relationships.map((r, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono">{r}</div>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <SectionLabel>Java Entity Code</SectionLabel>
                <CodeBlock language="java">{data.java_code}</CodeBlock>
            </div>
            <div>
                <SectionLabel>application.properties</SectionLabel>
                <CodeBlock language="yaml">{data.application_properties}</CodeBlock>
            </div>
        </div>
    );
}

function BackendPanel({ data }) {
    const [activeCode, setActiveCode] = useState("controller_code");
    if (!data) return null;

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
            <div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-4 flex-wrap gap-1">
                    {codeTabs.map(t => (
                        <button key={t.id} onClick={() => setActiveCode(t.id)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                                ${activeCode === t.id ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-gray-500 hover:text-gray-300"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <CodeBlock language="java">{data[activeCode] || "// No output for this section"}</CodeBlock>
            </div>
        </div>
    );
}

function DevOpsPanel({ data }) {
    const [activeFile, setActiveFile] = useState("dockerfile");
    if (!data) return null;

    const files = [
        { id: "dockerfile",     label: "Dockerfile",     lang: "yaml"  },
        { id: "docker_compose", label: "docker-compose", lang: "yaml"  },
        { id: "dockerignore",   label: ".dockerignore",  lang: "yaml"  },
        { id: "readme",         label: "README.md",      lang: "xml"   },
    ];

    const activeLang = files.find(f => f.id === activeFile)?.lang ?? "yaml";

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-500/10 to-transparent p-6 rounded-3xl border border-green-500/20">
                <div className="text-[10px] font-bold text-green-400 uppercase mb-1">DevOps Configuration</div>
                <div className="text-base text-white">{data.summary}</div>
            </div>
            <div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-4 flex-wrap gap-1">
                    {files.map(f => (
                        <button key={f.id} onClick={() => setActiveFile(f.id)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
                                ${activeFile === f.id ? "bg-green-500/20 text-green-300 border border-green-500/30" : "text-gray-500 hover:text-gray-300"}`}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <CodeBlock language={activeLang}>{data[activeFile] || "# No output"}</CodeBlock>
            </div>
        </div>
    );
}

function TestingPanel({ data }) {
    if (!data) return null;
    return (
        <div className="space-y-8">
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
            {data.errors?.length > 0 && (
                <div>
                    <SectionLabel>Errors / Warnings</SectionLabel>
                    <div className="space-y-2">
                        {data.errors.map((e, i) => (
                            <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">{e}</div>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <SectionLabel>Test Report</SectionLabel>
                <CodeBlock language="yaml">{data.test_report}</CodeBlock>
            </div>
            <div>
                <SectionLabel>Unit Tests (JUnit 5)</SectionLabel>
                <CodeBlock language="java">{data.unit_tests}</CodeBlock>
            </div>
        </div>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function StructuredOutput({ output }) {
    const [tab, setTab] = useState("system_analyst");
    if (!output) return null;

    return (
        <div className="fade-up">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 flex-wrap gap-1">
                    {TABS.map((t) => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                                ${tab === t.id
                                    ? "bg-[#bb29ff] text-white shadow-[0_0_15px_rgba(187,41,255,0.3)]"
                                    : "text-gray-500 hover:text-gray-300"
                                }`}>
                            {t.icon}<span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>
                <ExportButton data={output} filename="microservice-design.json" />
            </div>

            {tab === "system_analyst" && <AnalystPanel   data={output.system_analyst} />}
            {tab === "architect"      && <ArchitectPanel data={output.architect}      />}
            {tab === "database"       && <DatabasePanel  data={output.database}       />}
            {tab === "backend_layer"  && <BackendPanel   data={output.backend_layer}  />}
            {tab === "devops"         && <DevOpsPanel    data={output.devops}         />}
            {tab === "testing"        && <TestingPanel   data={output.testing}        />}
        </div>
    );
}

// //---------------------------------------------------------------------
// // frontend/src/components/StructuredOutput.jsx
// //
// // 6 tabs αντιστοιχούν στα 6 agent outputs:
// //   analyst   → system_analyst
// //   architect → architect
// //   database  → database
// //   backend   → backend_layer
// //   devops    → devops
// //   testing   → testing
//
// import { useState } from "react";
// import {
//     Download, Database, Layout, Server, Globe,
//     FlaskConical, Container, TestTube, ChevronRight,
// } from "lucide-react";
//
// // ── Tab config ────────────────────────────────────────────────────────────────
// const TABS = [
//     { id: "system_analyst", label: "Analysis",    icon: <Layout      size={14} /> },
//     { id: "architect",      label: "Architecture",icon: <Server      size={14} /> },
//     { id: "database",       label: "Database",    icon: <Database    size={14} /> },
//     { id: "backend_layer",  label: "Backend",     icon: <Globe       size={14} /> },
//     { id: "devops",         label: "DevOps",      icon: <Container   size={14} /> },
//     { id: "testing",        label: "Testing",     icon: <TestTube    size={14} /> },
// ];
//
// // ── Reusable sub-components ───────────────────────────────────────────────────
//
// function Chip({ children, variant = "default" }) {
//     const cls = {
//         default:  "bg-white/5 border-white/10 text-gray-300",
//         pro:      "bg-green-500/10 border-green-500/20 text-green-400",
//         entity:   "bg-[#bb29ff]/10 border-[#bb29ff]/20 text-[#bb29ff]",
//         method:   "bg-blue-500/10 border-blue-500/20 text-blue-400",
//         warning:  "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
//         error:    "bg-red-500/10 border-red-500/20 text-red-400",
//     }[variant] ?? "bg-white/5 border-white/10 text-gray-300";
//     return (
//         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
//             {children}
//         </span>
//     );
// }
//
// function SectionLabel({ children }) {
//     return (
//         <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 flex items-center gap-2">
//             <div className="w-1 h-1 bg-purple-500 rounded-full" />
//             {children}
//         </div>
//     );
// }
//
// // Block για code / preformatted text
// function CodeBlock({ children, lang = "" }) {
//     return (
//         <pre className="bg-black/40 border border-white/5 text-green-400 p-5 rounded-2xl text-xs overflow-x-auto leading-relaxed font-mono custom-scrollbar shadow-inner whitespace-pre-wrap">
//             {children}
//         </pre>
//     );
// }
//
// function ExportButton({ data, filename }) {
//     const handleExport = () => {
//         const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
//         const url  = URL.createObjectURL(blob);
//         const a    = document.createElement("a");
//         a.href = url; a.download = filename; a.click();
//         URL.revokeObjectURL(url);
//     };
//     return (
//         <button
//             onClick={handleExport}
//             className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] transition-all border border-white/5 px-4 py-2 rounded-xl hover:bg-white/5"
//         >
//             <Download size={14} /> Export JSON
//         </button>
//     );
// }
//
// // ── Tab Panels ────────────────────────────────────────────────────────────────
//
// // Tab 1: System Analyst
// // Fields: summary, requirements[], tech_stack{}, agent_plan[]
// function AnalystPanel({ data }) {
//     if (!data) return null;
//     return (
//         <div className="space-y-8">
//             {/* Summary */}
//             <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
//                 <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Project Summary</div>
//                 <div className="text-base text-white leading-relaxed">{data.summary}</div>
//             </div>
//
//             {/* Requirements */}
//             <div>
//                 <SectionLabel>Requirements</SectionLabel>
//                 <div className="flex flex-wrap gap-2">
//                     {data.requirements?.map((r, i) => <Chip key={i}>{r}</Chip>)}
//                 </div>
//             </div>
//
//             {/* Tech Stack */}
//             <div>
//                 <SectionLabel>Tech Stack</SectionLabel>
//                 <div className="grid grid-cols-2 gap-3">
//                     {data.tech_stack && Object.entries(data.tech_stack).map(([k, v]) => (
//                         <div key={k} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3">
//                             <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{k}</div>
//                             <div className="text-sm text-[#bb29ff] font-bold">{v}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//
//             {/* Agent Plan */}
//             <div>
//                 <SectionLabel>Agent Execution Plan</SectionLabel>
//                 <div className="flex items-center flex-wrap gap-2">
//                     {data.agent_plan?.map((step, i) => (
//                         <div key={i} className="flex items-center gap-2">
//                             <Chip variant="pro">{i + 1}. {step}</Chip>
//                             {i < data.agent_plan.length - 1 && <ChevronRight size={12} className="text-gray-600" />}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// // Tab 2: Architect
// // Fields: summary, package_structure, design_patterns[], uml_class, uml_sequence, tech_versions{}
// function ArchitectPanel({ data }) {
//     if (!data) return null;
//     return (
//         <div className="space-y-8">
//             <div className="bg-gradient-to-r from-[#bb29ff]/20 to-transparent p-6 rounded-3xl border border-[#bb29ff]/20">
//                 <div className="text-[10px] font-bold text-[#bb29ff] uppercase mb-1">Architecture Style</div>
//                 <div className="text-2xl font-bold text-white">{data.summary}</div>
//             </div>
//
//             {/* Design Patterns */}
//             <div>
//                 <SectionLabel>Design Patterns</SectionLabel>
//                 <div className="flex flex-wrap gap-2">
//                     {data.design_patterns?.map((p, i) => <Chip key={i} variant="entity">{p}</Chip>)}
//                 </div>
//             </div>
//
//             {/* Package Structure */}
//             <div>
//                 <SectionLabel>Package Structure</SectionLabel>
//                 <CodeBlock>{data.package_structure}</CodeBlock>
//             </div>
//
//             {/* UML Class */}
//             {data.uml_class && (
//                 <div>
//                     <SectionLabel>UML Class Diagram (PlantUML)</SectionLabel>
//                     <CodeBlock>{data.uml_class}</CodeBlock>
//                 </div>
//             )}
//
//             {/* UML Sequence */}
//             {data.uml_sequence && (
//                 <div>
//                     <SectionLabel>UML Sequence Diagram (PlantUML)</SectionLabel>
//                     <CodeBlock>{data.uml_sequence}</CodeBlock>
//                 </div>
//             )}
//
//             {/* Tech Versions */}
//             <div>
//                 <SectionLabel>Technology Versions</SectionLabel>
//                 <div className="grid grid-cols-2 gap-3">
//                     {data.tech_versions && Object.entries(data.tech_versions).map(([k, v]) => (
//                         <div key={k} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3">
//                             <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{k}</div>
//                             <div className="text-sm text-green-400 font-mono font-bold">{v}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// // Tab 3: Database Agent
// // Fields: summary, entities[], relationships[], java_code, application_properties
// function DatabasePanel({ data }) {
//     if (!data) return null;
//     return (
//         <div className="space-y-8">
//             {/* Entities */}
//             <div>
//                 <SectionLabel>JPA Entities</SectionLabel>
//                 <div className="flex flex-wrap gap-2">
//                     {data.entities?.map((e, i) => (
//                         <Chip key={i} variant="entity">{e.name} → {e.table}</Chip>
//                     ))}
//                 </div>
//             </div>
//
//             {/* Relationships */}
//             {data.relationships?.length > 0 && (
//                 <div>
//                     <SectionLabel>Relationships</SectionLabel>
//                     <div className="space-y-2">
//                         {data.relationships.map((r, i) => (
//                             <div key={i} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono">
//                                 {r}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//
//             {/* Java Code */}
//             <div>
//                 <SectionLabel>Java Entity Code</SectionLabel>
//                 <CodeBlock>{data.java_code}</CodeBlock>
//             </div>
//
//             {/* application.properties */}
//             <div>
//                 <SectionLabel>application.properties</SectionLabel>
//                 <CodeBlock>{data.application_properties}</CodeBlock>
//             </div>
//         </div>
//     );
// }
//
// // Tab 4: Backend Layer
// // Fields: summary, dto_code, service_code, exception_code, controller_code, swagger_config
// function BackendPanel({ data }) {
//     const [activeCode, setActiveCode] = useState("controller_code");
//
//     if (!data) return null;
//
//     // Tabs μέσα στο tab για τα διάφορα αρχεία κώδικα
//     const codeTabs = [
//         { id: "controller_code", label: "Controllers" },
//         { id: "service_code",    label: "Services"    },
//         { id: "dto_code",        label: "DTOs"        },
//         { id: "exception_code",  label: "Exceptions"  },
//         { id: "swagger_config",  label: "Swagger"     },
//     ];
//
//     return (
//         <div className="space-y-8">
//             <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-6 rounded-3xl border border-blue-500/20">
//                 <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Backend Layer</div>
//                 <div className="text-base text-white">{data.summary}</div>
//             </div>
//
//             {/* Inner code tabs */}
//             <div>
//                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-4 flex-wrap gap-1">
//                     {codeTabs.map(t => (
//                         <button
//                             key={t.id}
//                             onClick={() => setActiveCode(t.id)}
//                             className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
//                                 ${activeCode === t.id
//                                 ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
//                                 : "text-gray-500 hover:text-gray-300"
//                             }`}
//                         >
//                             {t.label}
//                         </button>
//                     ))}
//                 </div>
//                 <CodeBlock>{data[activeCode] || "// No output for this section"}</CodeBlock>
//             </div>
//         </div>
//     );
// }
//
// // Tab 5: DevOps
// // Fields: summary, dockerfile, docker_compose, dockerignore, readme
// function DevOpsPanel({ data }) {
//     const [activeFile, setActiveFile] = useState("dockerfile");
//
//     if (!data) return null;
//
//     const files = [
//         { id: "dockerfile",     label: "Dockerfile"       },
//         { id: "docker_compose", label: "docker-compose"   },
//         { id: "dockerignore",   label: ".dockerignore"    },
//         { id: "readme",         label: "README.md"        },
//     ];
//
//     return (
//         <div className="space-y-8">
//             <div className="bg-gradient-to-r from-green-500/10 to-transparent p-6 rounded-3xl border border-green-500/20">
//                 <div className="text-[10px] font-bold text-green-400 uppercase mb-1">DevOps Configuration</div>
//                 <div className="text-base text-white">{data.summary}</div>
//             </div>
//
//             <div>
//                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-4 flex-wrap gap-1">
//                     {files.map(f => (
//                         <button
//                             key={f.id}
//                             onClick={() => setActiveFile(f.id)}
//                             className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all
//                                 ${activeFile === f.id
//                                 ? "bg-green-500/20 text-green-300 border border-green-500/30"
//                                 : "text-gray-500 hover:text-gray-300"
//                             }`}
//                         >
//                             {f.label}
//                         </button>
//                     ))}
//                 </div>
//                 <CodeBlock>{data[activeFile] || "# No output for this file"}</CodeBlock>
//             </div>
//         </div>
//     );
// }
//
// // Tab 6: Testing
// // Fields: summary, unit_tests, test_report, errors[], coverage_estimate
// function TestingPanel({ data }) {
//     if (!data) return null;
//     return (
//         <div className="space-y-8">
//             {/* Coverage + Summary */}
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-3xl border border-yellow-500/20">
//                     <div className="text-[10px] font-bold text-yellow-400 uppercase mb-1">Coverage Estimate</div>
//                     <div className="text-3xl font-black text-white">{data.coverage_estimate}</div>
//                 </div>
//                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
//                     <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Summary</div>
//                     <div className="text-sm text-gray-300 leading-relaxed">{data.summary}</div>
//                 </div>
//             </div>
//
//             {/* Errors */}
//             {data.errors?.length > 0 && (
//                 <div>
//                     <SectionLabel>Errors / Warnings</SectionLabel>
//                     <div className="space-y-2">
//                         {data.errors.map((e, i) => (
//                             <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
//                                 {e}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//
//             {/* Test Report */}
//             <div>
//                 <SectionLabel>Test Report</SectionLabel>
//                 <CodeBlock>{data.test_report}</CodeBlock>
//             </div>
//
//             {/* Unit Tests Code */}
//             <div>
//                 <SectionLabel>Unit Tests (JUnit 5)</SectionLabel>
//                 <CodeBlock>{data.unit_tests}</CodeBlock>
//             </div>
//         </div>
//     );
// }
//
// // ── Main Component ────────────────────────────────────────────────────────────
//
// export default function StructuredOutput({ output }) {
//     const [tab, setTab] = useState("system_analyst");
//
//     // output είναι το structured_output dict από το backend
//     // Αναμένουμε: { system_analyst, architect, database, backend_layer, devops, testing }
//     if (!output) return null;
//
//     return (
//         <div className="fade-up">
//             {/* Top bar: tabs + export */}
//             <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
//                 <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 flex-wrap gap-1">
//                     {TABS.map((t) => (
//                         <button
//                             key={t.id}
//                             onClick={() => setTab(t.id)}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
//                                 ${tab === t.id
//                                 ? "bg-[#bb29ff] text-white shadow-[0_0_15px_rgba(187,41,255,0.3)]"
//                                 : "text-gray-500 hover:text-gray-300"
//                             }`}
//                         >
//                             {t.icon}
//                             <span className="hidden sm:inline">{t.label}</span>
//                         </button>
//                     ))}
//                 </div>
//                 <ExportButton data={output} filename="microservice-design.json" />
//             </div>
//
//             {/* Panel rendering */}
//             {tab === "system_analyst" && <AnalystPanel   data={output.system_analyst} />}
//             {tab === "architect"      && <ArchitectPanel data={output.architect}      />}
//             {tab === "database"       && <DatabasePanel  data={output.database}       />}
//             {tab === "backend_layer"  && <BackendPanel   data={output.backend_layer}  />}
//             {tab === "devops"         && <DevOpsPanel    data={output.devops}         />}
//             {tab === "testing"        && <TestingPanel   data={output.testing}        />}
//         </div>
//     );
// }