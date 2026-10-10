import "server-only";
import type { AspectRatio } from "./types";

// REST shape mirrors the official client (github.com/higgsfield-ai/higgsfield-client):
//   POST {base}/{model-id}                 -> { request_id, status_url, cancel_url }
//   GET  {base}/requests/{request_id}/status -> { status, images?: [{url}], video?: {url} }
const BASE_URL = (process.env.HIGGSFIELD_BASE_URL ?? "https://platform.higgsfield.ai").replace(
  /\/+$/,
  "",
);

export const IMAGE_MODEL =
  process.env.HIGGSFIELD_IMAGE_MODEL ?? "bytedance/seedream/v4/text-to-image";
export const VIDEO_MODEL = process.env.HIGGSFIELD_VIDEO_MODEL ?? "higgsfield-ai/dop/standard";

const MOCK = process.env.HIGGSFIELD_MOCK === "true";

export type RemoteStatus =
  | { state: "queued" | "in_progress" }
  | { state: "completed"; url: string }
  | { state: "failed"; error: string };

export class HiggsfieldError extends Error {}

function credentials(): string {
  if (process.env.HF_KEY) return process.env.HF_KEY;
  const { HF_API_KEY, HF_API_SECRET } = process.env;
  if (HF_API_KEY && HF_API_SECRET) return `${HF_API_KEY}:${HF_API_SECRET}`;
  throw new HiggsfieldError(
    "Higgsfield credentials missing. Set HF_KEY, or HF_API_KEY and HF_API_SECRET.",
  );
}

async function request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path.replace(/^\/+/, "")}`, {
    method,
    headers: {
      Authorization: `Key ${credentials()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new HiggsfieldError(`Higgsfield ${res.status}: ${text.slice(0, 300) || res.statusText}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

async function submit(
  kind: "image" | "video",
  model: string,
  args: Record<string, unknown>,
): Promise<string> {
  if (MOCK) return `mock-${kind}-${crypto.randomUUID()}`;
  const data = await request<{ request_id?: string }>("POST", model, args);
  if (!data.request_id) throw new HiggsfieldError("Higgsfield did not return a request_id.");
  return data.request_id;
}

export function submitImage(prompt: string, aspectRatio: AspectRatio): Promise<string> {
  return submit("image", IMAGE_MODEL, { prompt, aspect_ratio: aspectRatio, resolution: "2K" });
}

export function submitVideo(prompt: string, imageUrl: string): Promise<string> {
  return submit("video", VIDEO_MODEL, { prompt, image_url: imageUrl, duration: 5 });
}

type StatusPayload = {
  status?: string;
  images?: { url?: string }[];
  video?: { url?: string };
  videos?: { url?: string }[];
  error?: string;
  message?: string;
};

function resultUrl(data: StatusPayload): string | undefined {
  return data.video?.url ?? data.videos?.[0]?.url ?? data.images?.[0]?.url;
}

export async function getStatus(requestId: string): Promise<RemoteStatus> {
  if (MOCK) return mockStatus(requestId);

  const data = await request<StatusPayload>(
    "GET",
    `requests/${encodeURIComponent(requestId)}/status`,
  );

  switch (data.status) {
    case "queued":
    case "in_progress":
      return { state: data.status };
    case "completed": {
      const url = resultUrl(data);
      return url
        ? { state: "completed", url }
        : { state: "failed", error: "Completed without a media URL." };
    }
    case "nsfw":
      return { state: "failed", error: "Blocked by the content filter (NSFW)." };
    case "canceled":
      return { state: "failed", error: "Generation was canceled." };
    case "failed":
      return { state: "failed", error: data.error ?? data.message ?? "Generation failed." };
    default:
      return { state: "failed", error: `Unknown status: ${data.status ?? "missing"}` };
  }
}

// Mock mode lets you build the UI without spending credits.
function mockStatus(requestId: string): RemoteStatus {
  const seed = requestId.slice(-8);
  if (requestId.startsWith("mock-video")) {
    return {
      state: "completed",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    };
  }
  return { state: "completed", url: `https://picsum.photos/seed/${seed}/1280/720` };
}
