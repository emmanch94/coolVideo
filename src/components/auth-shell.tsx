import Link from "next/link";
import { Logo } from "./logo";
import { PageBackground } from "./page-background";
import { Particles } from "./ui/particles";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-12">
      <PageBackground className="h-full" />
      <Particles className="pointer-events-none absolute inset-0" quantity={70} ease={70} color="#f5d0fe" />
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
