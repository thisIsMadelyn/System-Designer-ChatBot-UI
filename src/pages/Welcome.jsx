import { useNavigate } from "react-router-dom";
import DotGrid from "../components/DotGrid";

const FEATURES = [
    {
        icon: "📋",
        title: "Requirements Analysis",
        desc: "Automatically extracts functional, non-functional requirements and scale estimations from your description.",
    },
    {
        icon: "🏛️",
        title: "Architecture Design",
        desc: "Recommends Microservices vs Monolith with full tradeoff analysis tailored to your team and deadline.",
    },
    {
        icon: "🗄️",
        title: "Database Modeling",
        desc: "Generates complete MySQL schema with ERD diagrams and relationship definitions.",
    },
    {
        icon: "🔌",
        title: "API & Security Design",
        desc: "Designs REST endpoints with Spring Security JWT config and Docker Compose setup.",
    },
];

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full bg-[#0f0a1a] overflow-hidden flex flex-col items-center justify-center text-white">

            {/* Background Layer: Το Dot Grid που διάλεξες */}
            <div className="absolute inset-0 z-0">
                <DotGrid
                    baseColor="#2d233e"
                    activeColor="#bb29ff"
                    dotSize={3}
                    gap={25}
                />
            </div>

            {/* Overlay Gradient για να "σβήνει" το grid στις γωνίες */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0a1a] z-1" />

            {/* Content Area */}
            <main className="relative z-10 text-center px-6 max-w-4xl fade-up">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-[#bb29ff] text-xs font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase animate-pulse">
                    AI ASSISTED ARCHITECTURE
                </div>

                {/* Hero Title */}
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                    Spring <br />
                    <span className="text-[#bb29ff]">Scribe</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    Automate your system design workflow with our specialized AI agents.
                    From requirements to SQL schemas in seconds.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate("/register")}
                        className="px-8 py-4 bg-[#bb29ff] text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(187,41,255,0.4)] hover:scale-105 transition-all w-full md:w-auto"
                    >
                        Get Started
                    </button>

                    <button
                        onClick={() => navigate("/learn-more")}
                        className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 backdrop-blur-md transition-all w-full md:w-auto"
                    >
                        Learn More
                    </button>
                </div>

                {/* Login Link */}
                <p className="mt-8 text-gray-500 text-sm">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-[#bb29ff] hover:underline font-semibold">
                        Sign In
                    </button>
                </p>
            </main>

            {/* Footer Minimal */}
            <footer className="absolute bottom-8 z-10 text-gray-600 text-[10px] uppercase tracking-[0.2em]">
                © 2026 Developer Dashboard • Built for the NetCompany 2026 GenAI competition
            </footer>
        </div>
    );
}