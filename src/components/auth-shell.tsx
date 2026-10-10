import Link from "next/link";
import { Logo } from "./logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-12">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/30 via-fuchsia-500/20 to-orange-400/20 blur-3xl" />
      <div className="relative flex flex-col items-center gap-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Logo />
          CoolVideo
        </Link>
        {children}
      </div>
    </div>
  );
}
