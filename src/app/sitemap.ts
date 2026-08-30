import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

const STATIC_PATHS = [
  "",
  "/quienes-somos",
  "/equipo",
  "/servicios",
  "/proyectos",
  "/blog",
  "/resenas",
  "/faq",
  "/contacto",
  "/privacidad",
  "/terminos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  try {
    const supabase = createClient();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, locale, updated_at")
      .eq("is_published", true);

    posts?.forEach((post) => {
      entries.push({
        url: `${siteUrl}/${post.locale}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });

    const { data: projects } = await supabase
      .from("projects")
      .select("slug, locale, updated_at")
      .eq("is_published", true);

    projects?.forEach((project) => {
      entries.push({
        url: `${siteUrl}/${project.locale}/proyectos/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  } catch {
    // Si Supabase no está disponible en build time, se entrega el sitemap solo con rutas estáticas.
  }

  return entries;
}
