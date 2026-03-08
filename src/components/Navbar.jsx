import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ title, subtitle }) {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-cream/90 backdrop-blur border-b border-[rgba(193,123,63,0.12)]">
            {/* Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/projects")}
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center text-xl shadow-warm">
                    🏗️
                </div>
                <div>
                    <div className="font-serif text-lg font-bold text-espresso leading-tight">
                        {title || "System Designer"}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-latte">
                        {subtitle || "Architecture Assistant"}
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {user && (
                    <>
                        <div className="w-8 h-8 rounded-xl bg-amber-light border border-amber-border flex items-center justify-center text-sm font-bold text-amber">
                            {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm text-mocha hidden sm:block">{user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-latte hover:text-amber transition-colors px-3 py-1.5 rounded-xl hover:bg-amber-light"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}