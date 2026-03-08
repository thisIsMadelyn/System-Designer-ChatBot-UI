import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginUser, registerUser } from "../services/authService";

export function useAuth() {
    const { user, login, logout, restoreSession } = useAuthStore();
    const navigate = useNavigate();

    // Restore session on mount
    useEffect(() => {
        restoreSession();
    }, []);

    const handleLogin = async (email, password) => {
        await loginUser(email, password); // throws on error
        login(email, password);
        navigate("/projects");
    };

    const handleRegister = async (name, email, password) => {
        await registerUser(name, email, password);
        login(email, password);
        navigate("/projects");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return { user, handleLogin, handleRegister, handleLogout };
}