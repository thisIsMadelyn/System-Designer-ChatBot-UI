import { useNavigate, useParams } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";

export default function Sidebar() {
    const { projects } = useProjectStore();
    const { projectId } = useParams();
    const navigate = useNavigate();

    return (
        <aside className="w-64 border-r border-[rgba(193,123,63,0.12)] bg-white/50 h-full overflow-y-auto flex flex-col">
            <div className="px-5 py-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-latte mb-3">
                    My Projects
                </div>
                <div className="flex flex-col gap-1">
                    {projects.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => navigate(`/projects/${p.id}`)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all
                ${p.id === projectId
                                ? "bg-amber-light border border-amber-border text-amber font-medium"
                                : "text-mocha hover:bg-cream hover:text-espresso"
                            }`}
                        >
                            <div className="font-medium truncate">{p.name}</div>
                            <div className="text-xs text-latte mt-0.5">{p.designCount} design{p.designCount !== 1 ? "s" : ""}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto px-5 py-4 border-t border-[rgba(193,123,63,0.1)]">
                <button
                    onClick={() => navigate("/projects")}
                    className="w-full text-xs text-latte hover:text-amber transition-colors text-left"
                >
                    ← All Projects
                </button>
            </div>
        </aside>
    );
}