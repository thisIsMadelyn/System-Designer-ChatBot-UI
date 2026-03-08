import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Cpu, LogOut, User } from "lucide-react";

export default function Navbar({ title, subtitle }) {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 bg-[#0f0a1a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
            {/* Logo Section */}
            <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => navigate("/projects")}
            >
                {/* Tech Logo with Glow */}
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#bb29ff] to-[#2d233e] flex items-center justify-center shadow-[0_0_15px_rgba(187,41,255,0.2)] group-hover:shadow-[0_0_20px_rgba(187,41,255,0.4)] transition-all border border-purple-400/20">
                    <Cpu size={22} className="text-white" />
                    {/* Animated Pulse Dot */}
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full border-2 border-[#0f0a1a] animate-pulse"></div>
                </div>

                <div>
                    <div className="text-lg font-bold text-white leading-tight tracking-tight">
                        {title || "SpringScribe"}
                    </div>
                </div>
            </div>

            {/* Right Side: User Profile & Actions */}
            <div className="flex items-center gap-5">
                {user && (
                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        {/* User Avatar */}
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bb29ff] group-hover:bg-[#bb29ff]/10 group-hover:border-[#bb29ff]/30 transition-all">
                                <User size={18} />
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

