import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return buildMetadata({
    locale: params.locale,
    path: "/servicios",
    title: "Servicios",
    description: "Descubre los servicios de consultoría y desarrollo a medida de SofDev.",
  });
}

export default async function ServicesPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, slug, title, short_description, full_description")
    .eq("locale", params.locale)
    .eq("is_published", true)
    .order("display_order");

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold">{dict.nav.services}</h1>
      <div className="space-y-6">
        {services?.map((service) => (
          <GlassCard key={service.id} id={service.slug}>
            <h2 className="break-words text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 break-words opacity-80">{service.short_description}</p>
            {service.full_description && (
              <p className="mt-4 whitespace-pre-line text-sm opacity-70">{service.full_description}</p>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
