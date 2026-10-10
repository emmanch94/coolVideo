export function Logo({ className = "size-7" }: { className?: string }) {
  return (
    <span
      className={`${className} relative grid place-items-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 shadow-lg shadow-fuchsia-500/30`}
    >
      <svg viewBox="0 0 24 24" className="size-3.5 fill-white" aria-hidden>
        <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
      </svg>
    </span>
  );
}
