import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/project-view";
import { SiteHeader } from "@/components/site-header";
import { getProject, syncGenerations } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth.protect();
  const { id } = await params;
  const project = await getProject(id, userId);
  if (!project) notFound();
  const generations = await syncGenerations(project.id, userId);

  return (
    <div className="relative min-h-dvh">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[600px]" />
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ProjectView initialProject={project} initialGenerations={generations} />
      </main>
    </div>
  );
}
