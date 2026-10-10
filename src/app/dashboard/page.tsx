import { auth } from "@clerk/nextjs/server";
import { Film, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { CreateProjectForm } from "@/components/create-project-form";
import { PageBackground } from "@/components/page-background";
import { SiteHeader } from "@/components/site-header";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";
import { listProjects } from "@/lib/projects";
import { PENDING_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth.protect();
  const projects = await listProjects(userId);

  return (
    <div className="relative min-h-dvh">
      <PageBackground />
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <BlurFade>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Nuevo proyecto</h1>
          <p className="mt-2 text-muted">Pega un link y elige cómo quieres que se vea tu promo.</p>
        </BlurFade>
        <BlurFade delay={0.1} className="mt-8">
          <CreateProjectForm />
        </BlurFade>

        <h2 className="mt-16 text-xl font-semibold tracking-tight">Tus proyectos</h2>
        {projects.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted">
            Aún no tienes proyectos. ¡Crea el primero arriba!
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => {
              const images = p.generations.filter((g) => g.kind === "image");
              const videos = p.generations.filter((g) => g.kind === "video");
              const cover = images.find((g) => g.result_url)?.result_url ?? p.og_image;
              const pending = p.generations.some((g) => PENDING_STATUSES.includes(g.status));
              return (
                <BlurFade key={p.id} inView delay={Math.min(i, 8) * 0.05}>
                  <MagicCard className="rounded-2xl" gradientColor="#2a1838">
                    <Link href={`/projects/${p.id}`} className="group block">
                      <div className="relative aspect-video overflow-hidden bg-white/5">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover}
                            alt=""
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="skeleton size-full" />
                        )}
                        {pending && (
                          <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur">
                            <AnimatedShinyText className="block px-2.5 py-1 text-xs">
                              Generando…
                            </AnimatedShinyText>
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="truncate font-medium">
                          {p.brand?.name || p.title || p.source_url}
                        </p>
                        <p className="truncate text-xs text-muted">{p.source_url}</p>
                        <div className="mt-3 flex gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="size-3.5" /> {images.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <Film className="size-3.5" /> {videos.length}
                          </span>
                          <span className="ml-auto">
                            {new Date(p.created_at).toLocaleDateString("es")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </MagicCard>
                </BlurFade>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
