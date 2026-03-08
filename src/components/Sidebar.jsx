import { useNavigate, useParams } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { ChevronLeft, FolderGit2, Boxes } from "lucide-react";

export default function Sidebar() {
    const { projects } = useProjectStore();
    const { projectId } = useParams();
    const navigate = useNavigate();

    return (
        <aside className="w-64 bg-[#1a1425]/40 backdrop-blur-xl border-r border-white/5 h-full flex flex-col shadow-2xl">
            {/* Header Section */}
            <div className="px-6 py-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2 text-[#bb29ff] mb-1">
                    <Boxes size={16} />
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Project Nodes</h2>
                </div>
            </div>

            {/* Projects List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                <div className="flex flex-col gap-2">
                    {projects.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => navigate(`/projects/${p.id}`)}
                            className={`w-full group flex items-start gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                                ${p.id === projectId
                                ? "bg-[#bb29ff]/10 border border-[#bb29ff]/30 text-white shadow-[0_0_15px_rgba(187,41,255,0.1)]"
                                : "text-gray-500 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                            }`}
                        >
                            <FolderGit2
                                size={18}
                                className={`mt-0.5 shrink-0 ${p.id === projectId ? "text-[#bb29ff]" : "text-gray-600 group-hover:text-gray-400"}`}
                            />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold truncate tracking-tight">{p.name}</span>
                                <span className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 
                                    ${p.id === projectId ? "text-purple-400" : "text-gray-600"}`}>
                                    {p.designCount || 0} Layers
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer: Back Action */}
            <div className="mt-auto px-4 py-6 border-t border-white/5 bg-white/5">
                <button
                    onClick={() => navigate("/projects")}
                    className="group flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] hover:bg-[#bb29ff]/5 transition-all"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Workspace
                </button>
            </div>
        </aside>
    );
}