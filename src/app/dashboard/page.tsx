import { auth } from "@clerk/nextjs/server";
import { Film, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { CreateProjectForm } from "@/components/create-project-form";
import { SiteHeader } from "@/components/site-header";
import { listProjects } from "@/lib/projects";
import { PENDING_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth.protect();
  const projects = await listProjects(userId);

  return (
    <div className="relative min-h-dvh">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Nuevo proyecto</h1>
        <p className="mt-2 text-muted">Pega un link y elige cómo quieres que se vea tu promo.</p>
        <div className="mt-8">
          <CreateProjectForm />
        </div>

        <h2 className="mt-16 text-xl font-semibold tracking-tight">Tus proyectos</h2>
        {projects.length === 0 ? (
          <p className="glass mt-4 rounded-2xl p-8 text-center text-sm text-muted">
            Aún no tienes proyectos. ¡Crea el primero arriba!
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const images = p.generations.filter((g) => g.kind === "image");
              const videos = p.generations.filter((g) => g.kind === "video");
              const cover = images.find((g) => g.result_url)?.result_url ?? p.og_image;
              const pending = p.generations.some((g) => PENDING_STATUSES.includes(g.status));
              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="glass group overflow-hidden rounded-2xl transition hover:border-white/20"
                >
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
                      <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs backdrop-blur">
                        Generando…
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="truncate font-medium">{p.brand?.name || p.title || p.source_url}</p>
                    <p className="truncate text-xs text-muted">{p.source_url}</p>
                    <div className="mt-3 flex gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="size-3.5" /> {images.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Film className="size-3.5" /> {videos.length}
                      </span>
                      <span className="ml-auto">{new Date(p.created_at).toLocaleDateString("es")}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
