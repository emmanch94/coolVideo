import "server-only";
import { getStatus, IMAGE_MODEL, submitImage, submitVideo, VIDEO_MODEL } from "./higgsfield";
import type { ScrapedPage } from "./scrape";
import { buildImagePrompt, buildVideoPrompt, getStyle } from "./styles";
import { supabaseAdmin } from "./supabase";
import type { AspectRatio, Generation, Project } from "./types";

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 500);

export async function createProject(opts: {
  userId: string;
  page: ScrapedPage;
  styles: string[];
  aspectRatio: AspectRatio;
  withVideo: boolean;
}): Promise<Project> {
  const db = supabaseAdmin();
  const { data: project, error } = await db
    .from("projects")
    .insert({
      user_id: opts.userId,
      source_url: opts.page.url,
      title: opts.page.title,
      description: opts.page.description,
      og_image: opts.page.ogImage,
      brand: opts.page.brand,
      aspect_ratio: opts.aspectRatio,
    })
    .select()
    .single<Project>();
  if (error || !project) throw new Error(error?.message ?? "Could not create project.");

  await Promise.all(
    opts.styles.map(async (styleId) => {
      const style = getStyle(styleId);
      if (!style) return;

      const prompt = buildImagePrompt(style, project.brand);
      let requestId: string | null = null;
      let failure: string | null = null;
      try {
        requestId = await submitImage(prompt, opts.aspectRatio);
      } catch (e) {
        failure = errorMessage(e);
      }

      const { data: image, error: imageError } = await db
        .from("generations")
        .insert({
          project_id: project.id,
          user_id: opts.userId,
          style: styleId,
          kind: "image",
          status: failure ? "failed" : "queued",
          prompt,
          model: IMAGE_MODEL,
          request_id: requestId,
          error: failure,
        })
        .select("id")
        .single<{ id: string }>();
      if (imageError || !image) throw new Error(imageError?.message ?? "Insert failed.");

      if (opts.withVideo) {
        await db.from("generations").insert({
          project_id: project.id,
          user_id: opts.userId,
          parent_id: image.id,
          style: styleId,
          kind: "video",
          status: failure ? "failed" : "waiting",
          prompt: buildVideoPrompt(style, project.brand),
          model: VIDEO_MODEL,
          error: failure ? "Source image failed." : null,
        });
      }
    }),
  );

  return project;
}

export async function getProject(id: string, userId: string): Promise<Project | null> {
  const { data } = await supabaseAdmin()
    .from("projects")
    .select()
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle<Project>();
  return data;
}

async function listGenerations(projectId: string, userId: string): Promise<Generation[]> {
  const { data, error } = await supabaseAdmin()
    .from("generations")
    .select()
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .returns<Generation[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Pulls fresh status from Higgsfield for every pending generation of a project and
 * chains image -> video once a source image is ready. Safe to call concurrently: video
 * submission is claimed with a conditional update so it only happens once.
 */
export async function syncGenerations(projectId: string, userId: string): Promise<Generation[]> {
  const db = supabaseAdmin();
  const gens = await listGenerations(projectId, userId);

  const inFlight = gens.filter(
    (g) => (g.status === "queued" || g.status === "in_progress") && g.request_id,
  );
  await Promise.all(
    inFlight.map(async (g) => {
      try {
        const remote = await getStatus(g.request_id!);
        if (remote.state === "completed") {
          Object.assign(g, { status: "completed", result_url: remote.url });
          await db.from("generations").update({ status: "completed", result_url: remote.url }).eq("id", g.id);
        } else if (remote.state === "failed") {
          Object.assign(g, { status: "failed", error: remote.error });
          await db.from("generations").update({ status: "failed", error: remote.error }).eq("id", g.id);
        } else if (remote.state !== g.status) {
          g.status = remote.state;
          await db.from("generations").update({ status: remote.state }).eq("id", g.id);
        }
      } catch (e) {
        // Transient API errors: leave the row pending and try again on the next poll.
        console.error(`[sync] status check failed for ${g.id}:`, errorMessage(e));
      }
    }),
  );

  // Recover videos whose submission was interrupted (e.g. the server died mid-request).
  const staleBefore = Date.now() - 2 * 60_000;
  for (const g of gens) {
    if (g.status === "submitting" && Date.parse(g.updated_at) < staleBefore) {
      const { data } = await db
        .from("generations")
        .update({ status: "waiting" })
        .eq("id", g.id)
        .eq("status", "submitting")
        .is("request_id", null)
        .select("id");
      if (data?.length) g.status = "waiting";
    }
  }

  const byId = new Map(gens.map((g) => [g.id, g]));
  await Promise.all(
    gens
      .filter((g) => g.kind === "video" && g.status === "waiting" && g.parent_id)
      .map(async (video) => {
        const parent = byId.get(video.parent_id!);
        if (!parent || parent.status === "failed") {
          await db
            .from("generations")
            .update({ status: "failed", error: "Source image failed." })
            .eq("id", video.id)
            .eq("status", "waiting");
          return;
        }
        if (parent.status !== "completed" || !parent.result_url) return;

        const { data: claimed } = await db
          .from("generations")
          .update({ status: "submitting" })
          .eq("id", video.id)
          .eq("status", "waiting")
          .select("id");
        if (!claimed?.length) return;

        try {
          const requestId = await submitVideo(video.prompt, parent.result_url);
          await db.from("generations").update({ status: "queued", request_id: requestId }).eq("id", video.id);
        } catch (e) {
          await db.from("generations").update({ status: "failed", error: errorMessage(e) }).eq("id", video.id);
        }
      }),
  );

  return listGenerations(projectId, userId);
}

export async function listProjects(userId: string) {
  const { data, error } = await supabaseAdmin()
    .from("projects")
    .select("id, source_url, title, og_image, brand, aspect_ratio, created_at, generations(id, kind, status, result_url)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as (Pick<
    Project,
    "id" | "source_url" | "title" | "og_image" | "brand" | "aspect_ratio" | "created_at"
  > & { generations: Pick<Generation, "id" | "kind" | "status" | "result_url">[] })[];
}

export async function deleteProject(id: string, userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin()
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");
  return Boolean(data?.length);
}
