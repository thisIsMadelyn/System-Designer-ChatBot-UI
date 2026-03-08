import { useState } from "react";
import Button from "./Button";

const SELECTS = [
    {
        key: "team_size", icon: "👥", label: "Team Size",
        opts: ["1 developer (solo)", "2–3 developers", "4–6 developers", "7–15 developers", "15+ developers"],
    },
    {
        key: "scale", icon: "📈", label: "Expected Scale",
        opts: ["< 1,000 users/day", "1k–10k users/day", "10k–100k users/day", "100k+ users/day"],
    },
    {
        key: "deadline", icon: "⏰", label: "Deadline",
        opts: ["< 1 month", "1–3 months", "3–6 months", "6–12 months", "12+ months"],
    },
    {
        key: "capital_constraints", icon: "💰", label: "Budget",
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

    const fieldCls = "w-full bg-[#FFFDF9] border border-[rgba(193,123,63,0.2)] rounded-2xl px-4 py-2.5 text-sm text-espresso placeholder:text-latte outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/10 focus:bg-white";
    const labelCls = "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-mocha mb-1.5";
    const iconCls  = "w-5 h-5 bg-amber-light rounded-md flex items-center justify-center text-xs";

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto pb-4">
            {/* Description */}
            <div>
                <div className={labelCls}><span className={iconCls}>📋</span>Project Description *</div>
                <textarea
                    className={`${fieldCls} resize-none`}
                    rows={3}
                    placeholder="e.g. An e-commerce platform with user auth, product catalog and order management..."
                    value={form.project_description}
                    onChange={(e) => set("project_description", e.target.value)}
                />
            </div>

            {/* Selects */}
            {SELECTS.map(({ key, icon, label, opts }) => (
                <div key={key}>
                    <div className={labelCls}><span className={iconCls}>{icon}</span>{label} *</div>
                    <select
                        className={`${fieldCls} cursor-pointer`}
                        value={form[key]}
                        onChange={(e) => set(key, e.target.value)}
                    >
                        <option value="">Select...</option>
                        {opts.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
            ))}

            {/* Tech */}
            <div>
                <div className={labelCls}><span className={iconCls}>🔧</span>Tech Constraints *</div>
                <input
                    className={fieldCls}
                    placeholder="e.g. Spring Boot, MySQL, Docker..."
                    value={form.tech_constraints}
                    onChange={(e) => set("tech_constraints", e.target.value)}
                />
            </div>

            {/* Extra */}
            <div>
                <div className={labelCls}><span className={iconCls}>✏️</span>Extra Details</div>
                <textarea
                    className={`${fieldCls} resize-none`}
                    rows={2}
                    placeholder="Any additional context..."
                    value={form.extra_details}
                    onChange={(e) => set("extra_details", e.target.value)}
                />
            </div>

            <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="w-full mt-1"
            >
                {loading ? "⚙️ Designing..." : "✦ Generate System Design"}
            </Button>
        </div>
    );
}