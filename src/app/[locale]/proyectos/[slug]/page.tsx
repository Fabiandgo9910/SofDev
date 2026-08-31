import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

async function getProject(locale: Locale, slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const project = await getProject(params.locale, params.slug);
  if (!project) return {};
  return buildMetadata({
    locale: params.locale,
    path: `/proyectos/${params.slug}`,
    title: project.title,
    description: project.summary,
    images: project.cover_image_url ? [project.cover_image_url] : undefined,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const project = await getProject(params.locale, params.slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <GlassCard>
        {project.cover_image_url && (
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
            <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.client_name && <p className="mt-1 text-sm opacity-70">Cliente: {project.client_name}</p>}
        <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line dark:prose-invert">
          {project.content}
        </div>
      </GlassCard>
    </article>
  );
}
