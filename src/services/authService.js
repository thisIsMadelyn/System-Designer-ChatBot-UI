/**
 * Mock auth service.
 * Replace with real API calls when backend auth is ready.
 */
import api from "./api";

export async function loginUser(email, password) {
    if (!email || !password) throw new Error("Email and password are required");
    const { data } = await api.post("/api/auth/login", { email, password });
    return data;
}

export async function registerUser(name, username, email, password) {
    if (!name || !username || !email || !password) throw new Error("All fields are required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const { data } = await api.post("/api/auth/register", { name, username, email, password });
    return data;
}

export async function fetchMe(token) {
    const { data } = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
}