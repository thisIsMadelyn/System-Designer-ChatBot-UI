import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 60000, // LLM calls can be slow
});

export default api;