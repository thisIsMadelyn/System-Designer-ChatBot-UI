import { useNavigate } from "react-router-dom";

const AGENTS = [
    {
        num: "01",
        icon: "📋",
        name: "Requirements Analyzer",
        color: "#bb29ff", // Neon Purple
        bg: "rgba(187, 41, 255, 0.1)",
        border: "rgba(187, 41, 255, 0.2)",
        desc: "Reads your project description and extracts functional requirements, non-functional requirements, constraints, and scale estimation. Sets the foundation for every decision that follows.",
        outputs: ["Functional requirements", "Non-functional requirements", "Team & budget constraints", "Scale estimation (users/day)"],
    },
    {
        num: "02",
        icon: "🏛️",
        name: "Architecture Designer",
        color: "#bb29ff", // Neon Purple
        bg: "rgba(187, 41, 255, 0.1)",
        border: "rgba(187, 41, 255, 0.2)",
        desc: "Analyzes requirements and decides between Microservices, Monolith, or Modular Monolith. Defines each service/module and explains tradeoffs with your specific constraints in mind.",
        outputs: ["Architecture style decision", "Service/module definitions", "Tech stack selection", "Tradeoff analysis (Pro/Con)"],
    },
    {
        num: "03",
        icon: "🗄️",
        name: "Database Modeler",
        color: "#bb29ff", // Neon Purple
        bg: "rgba(187, 41, 255, 0.1)",
        border: "rgba(187, 41, 255, 0.2)",
        desc: "Designs the complete MySQL schema based on the architecture. Creates entity definitions, relationships, and generates a Mermaid ERD diagram you can render directly.",
        outputs: ["Entity definitions with fields", "Relationship mapping", "Complete MySQL CREATE statements", "Mermaid ERD diagram"],
    },
    {
        num: "04",
        icon: "🔌",
        name: "API & Security Designer",
        color: "#bb29ff", // Neon Purple
        bg: "rgba(187, 41, 255, 0.1)",
        border: "rgba(187, 41, 255, 0.2)",
        desc: "Designs all REST endpoints with HTTP methods, auth requirements, and role-based access control. Generates Spring Security JWT configuration and a ready-to-use Docker Compose file.",
        outputs: ["REST endpoint definitions", "Spring Security JWT config", "Role-based access control", "Docker Compose configuration"],
    },
];

const TECH = [
    { icon: "🐍", name: "Python",       desc: "FastAPI backend"        },
    { icon: "🔗", name: "LangGraph",    desc: "Agent orchestration"    },
    { icon: "🤖", name: "GPT-4o",       desc: "AI model"               },
    { icon: "⚛️", name: "React",        desc: "Frontend"               },
    { icon: "🐘", name: "PostgreSQL",   desc: "Conversation history"   },
    { icon: "🐳", name: "Docker",       desc: "Containerization"       },
];

const FAQ = [
    {
        q: "Do I need an OpenAI API key to use it?",
        a: "No — the app runs in Mock Mode by default, which returns realistic example designs instantly. When you get an API key, set USE_MOCK=false in the backend .env and the system uses real GPT-4o.",
    },
    {
        q: "What kind of systems can it design?",
        a: "It specializes in Java Spring Boot systems — e-commerce, banking, healthcare, SaaS platforms, REST APIs, and more. It's optimized for MySQL, Spring Security JWT, and Docker deployments.",
    },
    {
        q: "Can I export the results?",
        a: "Yes — every design result can be exported as JSON from the Dashboard. The JSON includes all agent outputs: requirements, architecture, MySQL schema, ERD diagram, and API definitions.",
    },
    {
        q: "Does it remember previous conversations?",
        a: "Yes — conversations are stored per session in PostgreSQL. Each project has its own session history so you can revisit and continue previous design discussions.",
    },
];

export default function LearnMore() {
    const navigate = useNavigate();

    return (
        /* Αλλαγή background σε σκούρο μωβ */
        <div className="min-h-screen bg-[#0f0a1a] text-[#f8fafc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Navbar - Glassmorphism style */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 bg-[#0f0a1a]/80 backdrop-blur border-b border-purple-500/10">
                <button onClick={() => navigate("/")} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#bb29ff] to-[#2d233e] flex items-center justify-center text-base shadow-[0_0_15px_rgba(187,41,255,0.3)]">🏗️</div>
                    <span className="font-bold text-white tracking-tight">System Designer</span>
                </button>
                <div className="flex gap-3">
                    <button onClick={() => navigate("/login")} className="text-sm text-gray-400 hover:text-[#bb29ff] px-4 py-2 rounded-xl transition-colors">Sign In</button>
                    <button onClick={() => navigate("/register")} className="text-sm bg-[#bb29ff] text-white px-5 py-2 rounded-xl hover:bg-[#a824e6] shadow-[0_0_20px_rgba(187,41,255,0.2)] transition-all font-medium">Get Started</button>
                </div>
            </nav>

            {/* Hero */}
            <section className="text-center px-6 py-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-[#bb29ff] text-xs font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
                    How It Works
                </div>
                <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                    Four agents.<br />
                    <span className="text-[#bb29ff]">One complete design.</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Each agent is a specialized AI model with deep knowledge of its domain.
                    They run in sequence, passing context forward so every decision is informed by the previous one.
                </p>
            </section>

            {/* Agent Pipeline */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <div className="relative">
                    {/* Vertical connector line - Neon Purple Gradient */}
                    <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-[#bb29ff] to-transparent opacity-30" />

                    <div className="space-y-6">
                        {AGENTS.map((a, i) => (
                            <div key={a.num} className="flex gap-6 items-start fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                {/* Number bubble */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border relative z-10 backdrop-blur-md shadow-[0_0_20px_rgba(187,41,255,0.1)]"
                                    style={{ background: "rgba(45, 35, 62, 0.4)", borderColor: "rgba(187, 41, 255, 0.3)" }}
                                >
                                    {a.icon}
                                </div>

                                {/* Card - Glassmorphism */}
                                <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm hover:border-purple-500/30 transition-all group">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#bb29ff]">
                                          Agent {a.num}
                                        </span>
                                        <h3 className="font-bold text-white text-lg">{a.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{a.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {a.outputs.map((o) => (
                                            <span key={o} className="text-[10px] px-3 py-1 rounded-full bg-purple-500/10 text-[#bb29ff] border border-purple-500/20">
                                                {o}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack - Dark Section */}
            <section className="bg-black/40 border-t border-white/5 px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-2">Tech Stack</h2>
                    <p className="text-center text-gray-500 italic mb-10">Built with modern, production-grade tools</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {TECH.map((t) => (
                            <div key={t.name} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center hover:border-purple-500/40 transition-all hover:-translate-y-1">
                                <div className="text-2xl mb-2">{t.icon}</div>
                                <div className="font-semibold text-white text-sm">{t.name}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ - Darker Cards */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-white text-center mb-10">FAQ</h2>
                <div className="space-y-4">
                    {FAQ.map((f) => (
                        <div key={f.q} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                            <h4 className="font-bold text-[#bb29ff] mb-2">Q: {f.q}</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{f.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="text-center py-16 px-6 border-t border-white/5">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to start?</h2>
                <p className="text-gray-500 mb-8">Create a free account and design your first system in under a minute.</p>
                <button
                    onClick={() => navigate("/register")}
                    className="px-10 py-4 bg-[#bb29ff] text-white rounded-2xl text-base font-semibold shadow-[0_0_30px_rgba(187,41,255,0.3)] hover:scale-105 transition-all"
                >
                    Get Started Free →
                </button>
            </section>
        </div>
    );
}