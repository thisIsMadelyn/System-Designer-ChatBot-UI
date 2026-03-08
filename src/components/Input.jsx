export default function Input({
                                  label,
                                  type = "text",
                                  placeholder,
                                  value,
                                  onChange,
                                  required,
                                  icon,
                                  className = "",
                              }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-xs font-semibold uppercase tracking-widest text-mocha flex items-center gap-2">
                    {icon && <span className="w-5 h-5 bg-amber-light rounded-md flex items-center justify-center text-xs">{icon}</span>}
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full bg-[#FFFDF9] border border-[rgba(193,123,63,0.2)] rounded-2xl px-4 py-3 text-sm text-espresso placeholder:text-latte outline-none transition-all focus:border-amber focus:ring-2 focus:ring-amber/10 focus:bg-white"
            />
        </div>
    );
}