import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginUser, registerUser } from "../services/authService";

export function useAuth() {
    const { user, setAuth, logout, restoreSession } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        restoreSession();
    }, []);

    const handleLogin = async (email, password) => {
        const data = await loginUser(email, password);
        setAuth({ id: data.user_id, name: data.name, email: data.email }, data.token);
        navigate("/projects");
    };

    const handleRegister = async (name, username, email, password) => {
        const data = await registerUser(name, username, email, password);
        setAuth({ id: data.user_id, name: data.name, email: data.email }, data.token);
        navigate("/projects");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return { user, handleLogin, handleRegister, handleLogout };
}