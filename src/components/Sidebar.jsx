// frontend/src/components/Sidebar.jsx

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";
import { ChevronLeft, ChevronRight, FolderGit2, Boxes, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function Sidebar() {
    const { projects }  = useProjectStore();
    const { projectId } = useParams();
    const navigate      = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`
            relative h-full flex flex-col
            bg-[#1a1425]/40 backdrop-blur-xl border border-white/5
            rounded-3xl shadow-2xl transition-all duration-300 ease-in-out
            ${collapsed ? "w-14" : "w-64"}
        `}>

            {/* Toggle button — κολλητά στη δεξιά άκρη */}
            <button
                onClick={() => setCollapsed(c => !c)}
                className="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full bg-[#1a1425] border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#bb29ff] hover:border-[#bb29ff]/30 transition-all shadow-lg"
            >
                {collapsed
                    ? <PanelLeftOpen  size={12} />
                    : <PanelLeftClose size={12} />
                }
            </button>

            {/* Header */}
            <div className="px-4 py-5 border-b border-white/5 bg-white/5 rounded-t-3xl flex items-center gap-2">
                <Boxes size={16} className="text-[#bb29ff] shrink-0" />
                {!collapsed && (
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bb29ff] whitespace-nowrap">
                        Project Nodes
                    </h2>
                )}
            </div>

            {/* Projects list */}
            <div className="flex-1 overflow-y-auto px-2 py-4 custom-scrollbar">
                <div className="flex flex-col gap-2">
                    {projects.map((p) => {
                        const isActive = String(p.id) === String(projectId);
                        return (
                            <button
                                key={p.id}
                                onClick={() => navigate(`/projects/${p.id}`)}
                                title={collapsed ? p.name : undefined}
                                className={`w-full group flex items-center gap-3 px-2.5 py-3 rounded-2xl transition-all duration-300
                                    ${isActive
                                    ? "bg-[#bb29ff]/10 border border-[#bb29ff]/30 text-white shadow-[0_0_15px_rgba(187,41,255,0.1)]"
                                    : "text-gray-500 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                                }`}
                            >
                                <FolderGit2
                                    size={18}
                                    className={`shrink-0 ${isActive ? "text-[#bb29ff]" : "text-gray-600 group-hover:text-gray-400"}`}
                                />
                                {/* Κρύβεται όταν είναι collapsed */}
                                {!collapsed && (
                                    <div className="flex flex-col overflow-hidden text-left">
                                        <span className="text-sm font-bold truncate tracking-tight">{p.name}</span>
                                        <span className={`text-[10px] uppercase tracking-wider font-medium mt-0.5
                                            ${isActive ? "text-purple-400" : "text-gray-600"}`}>
                                            {p.designCount || 0} Layers
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="px-2 py-4 border-t border-white/5 bg-white/5 rounded-b-3xl">
                <button
                    onClick={() => navigate("/projects")}
                    title={collapsed ? "Back to Workspace" : undefined}
                    className="group flex items-center justify-center gap-2 w-full px-2.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#bb29ff] hover:bg-[#bb29ff]/5 transition-all"
                >
                    <ChevronLeft size={14} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
                    {!collapsed && <span className="whitespace-nowrap">Back to Workspace</span>}
                </button>
            </div>
        </aside>
    );
}