export default function Button({
                                   children,
                                   onClick,
                                   disabled,
                                   variant = "primary",  // primary | secondary | ghost | danger
                                   size    = "md",       // sm | md | lg
                                   className = "",
                                   type = "button",
                               }) {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:   "bg-gradient-to-br from-amber-500 to-amber-700 text-cream shadow-warm hover:shadow-warmLg hover:-translate-y-px active:translate-y-0",
        secondary: "bg-amber-light border border-amber-border text-amber hover:bg-amber-50",
        ghost:     "bg-transparent border border-[rgba(193,123,63,0.2)] text-mocha hover:border-amber hover:text-amber",
        danger:    "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100",
    };

    const sizes = {
        sm: "text-xs px-3 py-2",
        md: "text-sm px-4 py-2.5",
        lg: "text-base px-6 py-3.5",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}