/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Αντικατάσταση των καφέ με την παλέτα του Dot Grid
                bg: "#0f0a1a",
                surface: "#1a1425",
                primary: {
                    DEFAULT: "#bb29ff", // Το μωβ που ήθελες
                    light: "#d880ff",
                    dark: "#2d233e",    // Το baseColor του Dot Grid
                },
                accent: "#6a3fc1",
            },
            fontFamily: {
                sans: ["'DM Sans'", "sans-serif"],
            },
            borderRadius: {
                xl2: "20px",
                xl3: "24px",
            },
            boxShadow: {
                // Shadow που ταιριάζει σε μωβ/neon θέμα
                neon: "0 4px 16px rgba(187,41,255,0.15)",
                neonLg: "0 8px 32px rgba(187,41,255,0.2)",
            },
        },
    },
    plugins: [],
};