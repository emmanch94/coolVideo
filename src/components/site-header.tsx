import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Logo />
          CoolVideo
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Show
            when="signed-in"
            fallback={
              <>
                <SignInButton>
                  <button className="whitespace-nowrap rounded-full px-3 py-2 text-muted transition hover:text-foreground sm:px-4">
                    Iniciar sesión
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="whitespace-nowrap rounded-full bg-white px-4 py-2 font-medium text-black transition hover:bg-white/90">
                    Empezar gratis
                  </button>
                </SignUpButton>
              </>
            }
          >
            <Link
              href="/dashboard"
              className="whitespace-nowrap rounded-full px-3 py-2 text-muted transition hover:text-foreground sm:px-4"
            >
              Mis proyectos
            </Link>
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
