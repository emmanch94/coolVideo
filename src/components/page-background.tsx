import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

/** Dotted backdrop with a soft brand glow, shared by every page. */
export function PageBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden", className)}>
      <DotPattern
        width={22}
        height={22}
        className="text-white/[0.09] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_100%)]"
      />
      <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/25 via-fuchsia-500/20 to-orange-400/15 blur-3xl" />
    </div>
  );
}
