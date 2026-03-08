/**
 * Mock auth service.
 * Replace with real API calls when backend auth is ready.
 */

export async function loginUser(email, password) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    if (!email || !password) throw new Error("Email and password are required");

    // Mock: any credentials work
    return { email, name: email.split("@")[0] };
}

export async function registerUser(name, email, password) {
    await new Promise((r) => setTimeout(r, 800));

    if (!name || !email || !password) throw new Error("All fields are required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    return { name, email };
}