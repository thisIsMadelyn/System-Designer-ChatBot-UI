import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
    baseURL: BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 300000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("sda_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Redirect to login on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("sda_token");
            localStorage.removeItem("sda_user");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;