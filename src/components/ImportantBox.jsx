/**
 * Margin annotation boxes — the signature design element.
 * 3 variants: architecture (amber), constraint (red), recommendation (green)
 */
const VARIANTS = {
    architecture: {
        bg:     "bg-amber-light",
        border: "border-l-4 border-amber-border",
        label:  "text-amber",
        icon:   "🏛️",
        title:  "Architecture Decision",
    },
    constraint: {
        bg:     "bg-red-50",
        border: "border-l-4 border-red-300",
        label:  "text-red-700",
        icon:   "⚠️",
        title:  "Constraint",
    },
    recommendation: {
        bg:     "bg-green-50",
        border: "border-l-4 border-green-300",
        label:  "text-green-700",
        icon:   "💡",
        title:  "Recommendation",
    },
};

export default function ImportantBox({ variant = "recommendation", title, children }) {
    const v = VARIANTS[variant];
    return (
        <div className={`${v.bg} ${v.border} rounded-r-2xl px-4 py-3.5 my-3`}>
            <div className={`text-xs font-bold uppercase tracking-widest ${v.label} mb-1.5`}>
                {v.icon} {title || v.title}
            </div>
            <div className="text-sm leading-relaxed text-espresso">{children}</div>
        </div>
    );
}