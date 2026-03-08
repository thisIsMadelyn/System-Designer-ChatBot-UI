import { useState } from "react";
import Button from "./Button";
import { ClipboardList, Users, TrendingUp, Clock, Wallet, Wrench, PenTool, Sparkles } from "lucide-react";

const SELECTS = [
    {
        key: "team_size", icon: <Users size={14} />, label: "Team Size",
        opts: ["1 developer (solo)", "2–3 developers", "4–6 developers", "7–15 developers", "15+ developers"],
    },
    {
        key: "scale", icon: <TrendingUp size={14} />, label: "Expected Scale",
        opts: ["< 1,000 users/day", "1k–10k users/day", "10k–100k users/day", "100k+ users/day"],
    },
    {
        key: "deadline", icon: <Clock size={14} />, label: "Deadline",
        opts: ["< 1 month", "1–3 months", "3–6 months", "6–12 months", "12+ months"],
    },
    {
        key: "capital_constraints", icon: <Wallet size={14} />, label: "Budget",
        opts: ["Free tier only", "< $500/month", "$500–$2,000/month", "$2,000–$10,000/month", "Enterprise"],
    },
];

const EMPTY = {
    project_description: "",
    team_size: "",
    scale: "",
    deadline: "",
    tech_constraints: "Spring Boot, MySQL",
    capital_constraints: "",
    extra_details: "",
};

export default function DesignForm({ onSubmit, loading }) {
    const [form, setForm] = useState(EMPTY);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const canSubmit = form.project_description.trim() &&
        form.team_size && form.scale &&
        form.deadline && form.capital_constraints;

    const handleSubmit = () => {
        if (!canSubmit || loading) return;
        onSubmit(form);
        setForm(EMPTY);
    };

    // DARK THEME CLASSES - Ακριβώς όπως το Register/Login
    const fieldCls = "w-full bg-[#1a1425]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all focus:border-[#bb29ff] focus:bg-[#1a1425]/80";
    const labelCls = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-purple-400 mb-2 ml-1";
    const iconCls  = "text-[#bb29ff] opacity-80";

    // className="bg-[#1a1425] rounded-3xl p-6 border border-white/10"

    return (
        <div className="flex flex-col gap-5 h-full overflow-y-auto pb-6 custom-scrollbar">

            {/* Project Description */}
            <div>
                <div className={labelCls}>
                    <ClipboardList size={14} className={iconCls} />
                    Project Description *
                </div>
                <textarea
                    className={`${fieldCls} resize-none h-24`}
                    placeholder="e.g. E-commerce platform with auth and catalog..."
                    value={form.project_description}
                    onChange={(e) => set("project_description", e.target.value)}
                />
            </div>

            {/* Selection Fields */}
            <div className="grid grid-cols-1 gap-5">
                {SELECTS.map(({ key, icon, label, opts }) => (
                    <div key={key}>
                        <div className={labelCls}>
                            <span className={iconCls}>{icon}</span>
                            {label} *
                        </div>
                        <div className="relative">
                            <select
                                className={`${fieldCls} cursor-pointer appearance-none`}
                                value={form[key]}
                                onChange={(e) => set(key, e.target.value)}
                            >
                                <option value="" className="bg-[#0f0a1a]">Select...</option>
                                {opts.map((o) => (
                                    <option key={o} value={o} className="bg-[#0f0a1a]">{o}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 text-[10px]">▼</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tech Constraints */}
            <div>
                <div className={labelCls}>
                    <Wrench size={14} className={iconCls} />
                    Tech Constraints *
                </div>
                <input
                    className={fieldCls}
                    placeholder="e.g. Spring Boot, MySQL..."
                    value={form.tech_constraints}
                    onChange={(e) => set("tech_constraints", e.target.value)}
                />
            </div>

            {/* Extra Details */}
            <div>
                <div className={labelCls}>
                    <PenTool size={14} className={iconCls} />
                    Extra Details
                </div>
                <textarea
                    className={`${fieldCls} resize-none h-20`}
                    placeholder="Specific integrations, AWS, etc."
                    value={form.extra_details}
                    onChange={(e) => set("extra_details", e.target.value)}
                />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    className="w-full bg-[#bb29ff] hover:bg-[#a824e6] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(187,41,255,0.3)] hover:shadow-[0_0_30px_rgba(187,41,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Designing...</span>
                        </div>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            <span>Generate System Design</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}