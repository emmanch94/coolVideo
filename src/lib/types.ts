export type AspectRatio = "16:9" | "9:16" | "1:1";

export type GenerationKind = "image" | "video";

export type GenerationStatus =
  | "waiting"
  | "submitting"
  | "queued"
  | "in_progress"
  | "completed"
  | "failed";

export interface Brand {
  name: string;
  description: string;
  headlines: string[];
  summary: string;
  themeColor: string | null;
  favicon: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  source_url: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  brand: Brand;
  aspect_ratio: AspectRatio;
  created_at: string;
}

export interface Generation {
  id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  style: string;
  kind: GenerationKind;
  status: GenerationStatus;
  prompt: string;
  model: string;
  request_id: string | null;
  result_url: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export const PENDING_STATUSES: GenerationStatus[] = [
  "waiting",
  "submitting",
  "queued",
  "in_progress",
];
