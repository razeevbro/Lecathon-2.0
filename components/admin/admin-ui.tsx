export function AdminCard({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`bg-[#1a1a1a] border border-white/10 rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs text-[#888] mb-1 block">{label}</span>
      <input
        {...props}
        className={`w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 ${props.className ?? ""}`}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs text-[#888] mb-1 block">{label}</span>
      <textarea
        {...props}
        className={`w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 min-h-[88px] ${props.className ?? ""}`}
      />
    </label>
  );
}

export function AdminButton({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-yellow-400 text-black hover:bg-yellow-300"
      : variant === "danger"
        ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
        : "bg-white/5 text-white hover:bg-white/10 border border-white/10";

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${styles} ${props.className ?? ""}`}
    />
  );
}

export function AdminSelect({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[#888] mb-1 block">{label}</span>
      <select
        {...props}
        className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50"
      >
        {children}
      </select>
    </label>
  );
}
