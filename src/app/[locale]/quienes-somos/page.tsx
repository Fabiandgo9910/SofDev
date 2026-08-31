import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("title, subtitle")
    .eq("section_key", "quienes_somos")
    .eq("locale", params.locale)
    .maybeSingle();
  return buildMetadata({
    locale: params.locale,
    path: "/quienes-somos",
    title: data?.title ?? "Quiénes somos",
    description: data?.subtitle ?? "Conoce la historia y la misión de SofDev.",
  });
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const supabase = createClient();
  const { data: content } = await supabase
    .from("site_content")
    .select("title, subtitle, body, image_url")
    .eq("section_key", "quienes_somos")
    .eq("locale", params.locale)
    .maybeSingle();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <GlassCard>
        <h1 className="text-3xl font-bold">{content?.title ?? "Quiénes somos"}</h1>
        {content?.subtitle && <p className="mt-2 text-lg opacity-80">{content.subtitle}</p>}
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p className="whitespace-pre-line opacity-90">
            {content?.body ?? "Contenido editable desde el panel de administración."}
          </p>
        </div>
      </GlassCard>
    </section>
  );
}
