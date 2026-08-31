import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

export async function generateMetadata() {
  return { title: "Proyectos realizados" };
}

export default async function ProjectsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, summary, cover_image_url, tags")
    .eq("locale", params.locale)
    .eq("is_published", true)
    .order("display_order");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold">{dict.nav.projects}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Link key={project.id} href={`/${params.locale}/proyectos/${project.slug}`}>
            <GlassCard className="flex h-full flex-col">
              {project.cover_image_url && (
                <div className="relative mb-4 h-40 w-full shrink-0 overflow-hidden rounded-xl">
                  <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" />
                </div>
              )}
              <h3 className="line-clamp-2 break-words font-semibold">{project.title}</h3>
              <p className="mt-2 line-clamp-3 break-words text-sm opacity-80">{project.summary}</p>
              {!!project.tags?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag: string) => (
                    <span key={tag} className="glass-panel max-w-[10rem] truncate rounded-full px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
