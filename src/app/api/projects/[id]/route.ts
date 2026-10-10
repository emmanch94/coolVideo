import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteProject, getProject, syncGenerations } from "@/lib/projects";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await getProject(id, userId);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const generations = await syncGenerations(project.id, userId);
  return NextResponse.json({ project, generations });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deleted = await deleteProject(id, userId);
  return deleted
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
