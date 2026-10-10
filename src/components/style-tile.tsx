import type { VisualStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** Gradient poster used for a style in marquees and pickers. */
export function StyleTile({ style, className }: { style: VisualStyle; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] w-44 shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 sm:w-52",
        style.gradient,
        className,
      )}
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-white/15 blur-xl" />
      <span className="relative text-3xl drop-shadow">{style.emoji}</span>
      <div className="relative">
        <p className="font-semibold text-white drop-shadow">{style.name}</p>
        <p className="text-xs text-white/80">{style.tagline}</p>
      </div>
    </div>
  );
}
