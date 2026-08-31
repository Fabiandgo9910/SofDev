import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { Wrench } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

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
      <SectionHeading align="left" title={dict.nav.services} icon={Wrench} />
      <div className="space-y-6">
        {services?.map((service, i) => (
          <Reveal key={service.id} delay={i * 60}>
          <GlassCard id={service.slug}>
            <h2 className="break-words text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 break-words opacity-80">{service.short_description}</p>
            {service.full_description && (
              <p className="mt-4 whitespace-pre-line text-sm opacity-70">{service.full_description}</p>
            )}
          </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
