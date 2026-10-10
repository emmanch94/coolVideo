"use client";

import { Check, Film, Image as ImageIcon, Link2, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { STYLES } from "@/lib/styles";
import type { AspectRatio } from "@/lib/types";
import { cn as clsx } from "@/lib/utils";

const MAX_STYLES = 4;

const RATIOS: { value: AspectRatio; label: string; box: string }[] = [
  { value: "16:9", label: "Horizontal", box: "w-6 h-3.5" },
  { value: "9:16", label: "Vertical", box: "w-3.5 h-6" },
  { value: "1:1", label: "Cuadrado", box: "w-5 h-5" },
];

export function CreateProjectForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [styles, setStyles] = useState<string[]>(["motion-graphics", "vox"]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [withVideo, setWithVideo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleStyle(id: string) {
    setStyles((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length >= MAX_STYLES
          ? prev
          : [...prev, id],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, styles, aspectRatio, withVideo }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "No se pudo crear el proyecto.");
      router.push(`/projects/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  const disabled = loading || !url.trim() || styles.length === 0;

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/80 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6"
    >
      <label htmlFor="url" className="text-sm font-medium">
        URL de tu app o producto
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 focus-within:border-fuchsia-400/60">
          <Link2 className="size-4 shrink-0 text-muted" />
          <input
            id="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="https://tu-app.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
          />
        </div>
        <ShimmerButton
          type="submit"
          disabled={disabled}
          borderRadius="12px"
          shimmerColor="#fbcfe8"
          background="linear-gradient(110deg, #6d28d9 0%, #c026d3 55%, #ea580c 100%)"
          className="h-12 gap-2 px-6 text-sm font-medium shadow-lg shadow-fuchsia-600/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? "Analizando…" : "Generar"}
        </ShimmerButton>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-sm font-medium">Estilos</p>
        <p className="text-xs text-muted">
          {styles.length}/{MAX_STYLES} seleccionados
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {STYLES.map((s) => {
          const active = styles.includes(s.id);
          const full = !active && styles.length >= MAX_STYLES;
          return (
            <MagicCard
              key={s.id}
              gradientColor="#2a1838"
              gradientSize={160}
              className={clsx(
                "rounded-xl transition",
                active && "ring-2 ring-fuchsia-500/70",
                full && "opacity-40",
              )}
            >
              <button
                type="button"
                onClick={() => toggleStyle(s.id)}
                disabled={full}
                aria-pressed={active}
                className="relative block w-full p-3 text-left disabled:cursor-not-allowed"
              >
                <div className={`mb-3 h-10 rounded-lg bg-gradient-to-br ${s.gradient}`} />
                <p className="text-sm font-medium">
                  <span className="mr-1.5">{s.emoji}</span>
                  {s.name}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">{s.tagline}</p>
                {active && (
                  <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-fuchsia-500">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            </MagicCard>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">Formato</p>
          <div className="mt-2 inline-flex rounded-xl border border-white/10 bg-black/30 p-1">
            {RATIOS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setAspectRatio(r.value)}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition",
                  aspectRatio === r.value
                    ? "bg-white/10 text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                <span className={`${r.box} rounded-[3px] border border-current`} />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Salida</p>
          <div className="mt-2 inline-flex rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => setWithVideo(false)}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition",
                !withVideo ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              <ImageIcon className="size-3.5" /> Solo imágenes
            </button>
            <button
              type="button"
              onClick={() => setWithVideo(true)}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition",
                withVideo ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              <Film className="size-3.5" /> Imágenes + video
            </button>
          </div>
        </div>
      </div>

      <BorderBeam size={160} duration={9} colorFrom="#f472b6" colorTo="#a78bfa" />

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}
    </form>
  );
}
