import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DotGrid from "../components/DotGrid";
import { Cpu } from "lucide-react";

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState("");
    const [loading,  setLoading]  = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await handleLogin(email, password);
            navigate("/projects"); // Μεταφορά στα projects μετά το login
        } catch (e) {
            setError(e.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0f0a1a] flex items-center justify-center px-4 overflow-hidden">

            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <DotGrid
                    baseColor="#2d233e"
                    activeColor="#bb29ff"
                    dotSize={2}
                    gap={25}
                />
            </div>

            <div className="relative z-10 w-full max-w-sm fade-up">
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#bb29ff] to-[#2d233e] flex items-center justify-center shadow-[0_0_20px_rgba(187,41,255,0.3)] mb-4 border border-purple-500/20 group hover:scale-110 transition-transform">
                        <Cpu size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-xs text-purple-400 uppercase tracking-widest mt-1 font-medium">Access your Dashboard</p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="developer@workspace.com"
                                className="w-full bg-[#1a1425]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#bb29ff] transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1.5 ml-1">
                                <label className="text-xs font-medium text-gray-400">Password</label>
                                <a href="#" className="text-[10px] text-purple-400 hover:text-[#bb29ff]">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-[#1a1425]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#bb29ff] transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2 animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#bb29ff] text-white font-bold py-3 rounded-xl mt-2 shadow-[0_0_20px_rgba(187,41,255,0.2)] hover:shadow-[0_0_30_px_rgba(187,41,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Sign In →"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-8">
                        New to the platform?{" "}
                        <Link to="/register" className="text-[#bb29ff] hover:underline font-medium">Create account</Link>
                    </p>
                </div>
            </div>

            {/* Subtle Node Info */}
            <div className="absolute bottom-6 text-[10px] text-gray-700 tracking-[0.3em] uppercase">
                Node ID: ST-2026-X
            </div>
        </div>
    );
}