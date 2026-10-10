"use client";

import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStyle } from "@/lib/styles";
import { PENDING_STATUSES, type Generation, type Project } from "@/lib/types";
import { BlurFade } from "./ui/blur-fade";
import { NumberTicker } from "./ui/number-ticker";
import { MediaCard } from "./media-card";

const POLL_MS = 5000;

export function ProjectView({
  initialProject,
  initialGenerations,
}: {
  initialProject: Project;
  initialGenerations: Generation[];
}) {
  const router = useRouter();
  const project = initialProject;
  const [generations, setGenerations] = useState(initialGenerations);
  const [deleting, setDeleting] = useState(false);

  const pending = generations.some((g) => PENDING_STATUSES.includes(g.status));

  useEffect(() => {
    if (!pending) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}`, { cache: "no-store" });
        if (res.ok && !cancelled) setGenerations((await res.json()).generations);
      } catch {
        // network blip; the next tick retries
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [generations, pending, project.id]);

  async function onDelete() {
    if (!confirm("¿Eliminar este proyecto y todo su contenido?")) return;
    setDeleting(true);
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  const styleIds = Array.from(new Set(generations.map((g) => g.style)));
  const done = generations.filter((g) => g.status === "completed").length;

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Proyectos
      </Link>

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {project.brand.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.brand.favicon}
              alt=""
              className="mt-1 size-10 shrink-0 rounded-xl bg-white/10 object-contain p-1.5"
            />
          )}
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold tracking-tight">{project.brand.name}</h1>
            <a
              href={project.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm text-muted hover:text-foreground"
            >
              <span className="truncate">{project.source_url}</span>
              <ExternalLink className="size-3.5 shrink-0" />
            </a>
            {project.brand.description && (
              <p className="mt-3 max-w-2xl text-sm text-muted">{project.brand.description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="glass rounded-xl px-4 py-2 text-sm">
            <NumberTicker value={done} className="font-mono text-sm" />
            <span className="text-muted">/{generations.length} listos</span>
          </div>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="glass grid size-10 place-items-center rounded-xl text-muted transition hover:text-red-400 disabled:opacity-50"
            aria-label="Eliminar proyecto"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {pending && (
        <div className="mt-8 h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 transition-all duration-700"
            style={{ width: `${Math.max(8, (done / Math.max(1, generations.length)) * 100)}%` }}
          />
        </div>
      )}

      <div className="mt-10 space-y-12">
        {styleIds.map((styleId, si) => {
          const style = getStyle(styleId);
          const items = generations.filter((g) => g.style === styleId);
          return (
            <BlurFade key={styleId} delay={si * 0.08}>
              <section>
                <div className="flex items-center gap-3">
                  <span
                    className={`size-3 rounded-full bg-gradient-to-br ${style?.gradient ?? "from-white to-white"}`}
                  />
                  <h2 className="whitespace-nowrap text-lg font-semibold">
                    {style?.name ?? styleId}
                  </h2>
                  <span className="hidden text-sm text-muted sm:inline">{style?.tagline}</span>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {items.map((g) => (
                    <MediaCard key={g.id} generation={g} aspectRatio={project.aspect_ratio} />
                  ))}
                </div>
              </section>
            </BlurFade>
          );
        })}
      </div>
    </>
  );
}
