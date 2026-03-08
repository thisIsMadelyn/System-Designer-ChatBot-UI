import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Input from "../components/Input";
import { format } from "date-fns";

function NewProjectModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    return (
        <div className="fixed inset-0 bg-espresso/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl border border-[rgba(193,123,63,0.15)] p-8 w-full max-w-md shadow-warmLg fade-up">
                <h2 className="font-serif text-xl font-bold text-espresso mb-6">New Project</h2>
                <div className="space-y-4">
                    <Input label="Project Name" icon="📁" placeholder="e.g. E-Commerce Platform"
                           value={name} onChange={(e) => setName(e.target.value)} />
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-mocha mb-1.5 flex items-center gap-2">
                            <span className="w-5 h-5 bg-amber-light rounded-md flex items-center justify-center text-xs">📝</span>
                            Description
                        </div>
                        <textarea
                            className="w-full bg-[#FFFDF9] border border-[rgba(193,123,63,0.2)] rounded-2xl px-4 py-3 text-sm text-espresso placeholder:text-latte outline-none resize-none focus:border-amber focus:ring-2 focus:ring-amber/10"
                            rows={3}
                            placeholder="Briefly describe the project..."
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button variant="primary" onClick={() => { if (name.trim()) onCreate(name, desc); }} className="flex-1" disabled={!name.trim()}>
                        Create Project
                    </Button>
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
        <div className="min-h-screen bg-cream">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-espresso">My Projects</h1>
                        <p className="text-sm text-latte italic mt-1">Each project has its own design history and chat session</p>
                    </div>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        + New Project
                    </Button>
                </div>

                {/* Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🏗️</div>
                        <p className="font-serif text-xl text-espresso mb-2">No projects yet</p>
                        <p className="text-sm text-latte">Create your first project to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/projects/${p.id}`)}
                                className="bg-white border border-[rgba(193,123,63,0.12)] rounded-2xl p-6 cursor-pointer hover:shadow-warmLg hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-light flex items-center justify-center text-xl">
                                        📁
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-xs text-latte hover:text-red-600 transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <h3 className="font-serif font-bold text-espresso text-lg mb-1">{p.name}</h3>
                                <p className="text-sm text-latte line-clamp-2 mb-4">{p.description || "No description"}</p>
                                <div className="flex items-center justify-between text-xs text-latte">
                  <span className="bg-amber-light text-amber px-2.5 py-1 rounded-full font-medium">
                    {p.designCount} design{p.designCount !== 1 ? "s" : ""}
                  </span>
                                    <span>
                    {p.lastDesignAt
                        ? `Last: ${format(new Date(p.lastDesignAt), "MMM d")}`
                        : `Created ${format(new Date(p.createdAt), "MMM d")}`
                    }
                  </span>
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