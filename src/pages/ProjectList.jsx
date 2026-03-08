import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import DotGrid from "../components/DotGrid";
import Navbar from "../components/Navbar"; // Βεβαιώσου ότι ο Navbar είναι επίσης Dark πλέον
import { format } from "date-fns";
import { Plus, Folder, Trash2, Layout, Clock } from "lucide-react";

function NewProjectModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 px-4">
            <div className="bg-[#1a1425] rounded-3xl border border-white/10 p-8 w-full max-w-md shadow-2xl fade-up relative overflow-hidden">
                {/* Glow effect inside modal */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#bb29ff]/10 blur-[60px] rounded-full"></div>

                <h2 className="text-2xl font-bold text-white mb-6">New Project</h2>

                <div className="space-y-5 relative z-10">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2 block">Project Name</label>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#bb29ff] transition-all"
                            placeholder="e.g. E-Commerce Platform"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2 block">Description</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#bb29ff] transition-all resize-none"
                            rows={3}
                            placeholder="What are we designing today?"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8 relative z-10">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={() => { if (name.trim()) onCreate(name, desc); }}
                        className="flex-1 py-3 rounded-xl bg-[#bb29ff] text-white font-bold shadow-[0_0_20px_rgba(187,41,255,0.3)] disabled:opacity-50 transition-all"
                        disabled={!name.trim()}
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ProjectList() {
    const { projects, addProject, deleteProject } = useProjectStore();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleCreate = (name, desc) => {
        const p = addProject(name, desc);
        setShowModal(false);
        navigate(`/projects/${p.id}`);
    };

    return (
        <div className="relative min-h-screen bg-[#0f0a1a] text-white overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 opacity-40">
                <DotGrid baseColor="#2d233e" activeColor="#bb29ff" dotSize={2} gap={30} />
            </div>

            <Navbar />

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                            My Workspace
                        </h1>
                        <p className="text-gray-400 font-medium">Manage your system design architectures</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-[#bb29ff] text-white px-6 py-3 rounded-2xl font-bold shadow-[0_0_25px_rgba(187,41,255,0.3)] hover:scale-105 transition-all"
                    >
                        <Plus size={20} /> New Project
                    </button>
                </div>

                {/* Project Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-xl font-bold text-white mb-2">No projects active</p>
                        <p className="text-gray-500 max-w-xs mx-auto">Start a new project to generate requirements, ERDs, and API designs.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/projects/${p.id}`)}
                                className="group relative bg-[#1a1425]/60 border border-white/10 rounded-3xl p-6 cursor-pointer backdrop-blur-md hover:border-[#bb29ff]/50 transition-all hover:shadow-[0_0_30px_rgba(187,41,255,0.1)]"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#bb29ff] to-[#2d233e] flex items-center justify-center shadow-lg">
                                        <Folder className="text-white" size={24} />
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#bb29ff] transition-colors">{p.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-6 h-10">{p.description || "System design and architecture flow."}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 text-[#bb29ff] text-xs font-bold uppercase tracking-widest">
                                        <Layout size={14} />
                                        <span>{p.designCount || 0} Layers</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium uppercase tracking-wider">
                                        <Clock size={12} />
                                        <span>{p.createdAt ? format(new Date(p.createdAt), "MMM d") : "New"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showModal && (
                <NewProjectModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
            )}
        </div>
    );
}
