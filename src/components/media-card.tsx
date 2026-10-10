import { clsx } from "clsx";
import { AlertTriangle, Download, Film, Image as ImageIcon, Loader2 } from "lucide-react";
import type { AspectRatio, Generation, GenerationStatus } from "@/lib/types";

const STATUS_LABEL: Record<GenerationStatus, string> = {
  waiting: "Esperando imagen",
  submitting: "Enviando",
  queued: "En cola",
  in_progress: "Generando",
  completed: "Listo",
  failed: "Error",
};

const ASPECT: Record<AspectRatio, string> = {
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16] max-h-[640px] mx-auto",
  "1:1": "aspect-square",
};

export function MediaCard({ generation: g, aspectRatio }: { generation: Generation; aspectRatio: AspectRatio }) {
  const isVideo = g.kind === "video";
  const Icon = isVideo ? Film : ImageIcon;

  return (
    <figure className="glass overflow-hidden rounded-2xl">
      <div className={clsx("relative w-full overflow-hidden bg-black/40", ASPECT[aspectRatio])}>
        {g.status === "completed" && g.result_url ? (
          isVideo ? (
            <video
              src={g.result_url}
              className="size-full object-cover"
              controls
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={g.result_url} alt={`Imagen ${g.style}`} className="size-full object-cover" />
          )
        ) : g.status === "failed" ? (
          <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center">
            <AlertTriangle className="size-6 text-red-400" />
            <p className="text-sm text-red-300">{g.error ?? "La generación falló."}</p>
          </div>
        ) : (
          <div className="skeleton flex size-full flex-col items-center justify-center gap-3">
            <Loader2 className="size-6 animate-spin text-fuchsia-300" />
            <p className="text-sm text-muted">{STATUS_LABEL[g.status]}…</p>
          </div>
        )}
      </div>
      <figcaption className="flex items-center gap-2 px-4 py-3 text-sm">
        <Icon className="size-4 text-muted" />
        <span>{isVideo ? "Video" : "Imagen"}</span>
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-xs",
            g.status === "completed" && "bg-emerald-500/15 text-emerald-300",
            g.status === "failed" && "bg-red-500/15 text-red-300",
            g.status !== "completed" && g.status !== "failed" && "bg-white/10 text-muted",
          )}
        >
          {STATUS_LABEL[g.status]}
        </span>
        {g.status === "completed" && g.result_url && (
          <a
            href={g.result_url}
            target="_blank"
            rel="noreferrer"
            download
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted transition hover:bg-white/10 hover:text-foreground"
          >
            <Download className="size-3.5" /> Descargar
          </a>
        )}
      </figcaption>
    </figure>
  );
}
