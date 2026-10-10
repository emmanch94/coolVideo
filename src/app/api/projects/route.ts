import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createProject, listProjects } from "@/lib/projects";
import { scrapePage, ScrapeError } from "@/lib/scrape";
import { STYLE_IDS } from "@/lib/styles";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  url: z
    .string()
    .trim()
    .min(4)
    .max(2048)
    .transform((u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`)),
  styles: z.array(z.enum(STYLE_IDS)).min(1).max(4),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
  withVideo: z.boolean().default(true),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ projects: await listProjects(userId) });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  try {
    const page = await scrapePage(parsed.data.url);
    const project = await createProject({ userId, page, ...parsed.data });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    if (e instanceof ScrapeError) {
      return NextResponse.json({ error: e.message }, { status: 422 });
    }
    console.error("[projects] create failed:", e);
    return NextResponse.json({ error: "Something went wrong creating the project." }, { status: 500 });
  }
}
