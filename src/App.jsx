import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import Welcome          from "./pages/Welcome.jsx";
import LearnMore        from "./pages/LearnMore.jsx";
import Login            from "./pages/Login.jsx";
import Register         from "./pages/Register.jsx";
import ProjectList      from "./pages/ProjectList.jsx";
import ProjectDashboard from "./pages/ProjectDashboard.jsx";

function PrivateRoute({ children }) {
    const { user } = useAuthStore();
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/"           element={<Welcome />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/projects" element={
                <PrivateRoute><ProjectList /></PrivateRoute>
            } />
            <Route path="/projects/:projectId" element={
                <PrivateRoute><ProjectDashboard /></PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
