import type { Locale } from "@/lib/i18n/config";
import { buildMetadata, buildFaqJsonLd } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { FaqAccordion } from "@/components/faq-accordion";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return buildMetadata({
    locale: params.locale,
    path: "/faq",
    title: "Preguntas frecuentes",
    description: "Resolvemos las dudas más habituales sobre nuestros servicios.",
  });
}

export default async function FaqPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: items } = await supabase
    .from("faq_items")
    .select("id, question, answer")
    .eq("locale", params.locale)
    .eq("is_published", true)
    .order("display_order");

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {!!items?.length && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(items)) }}
        />
      )}
      <h1 className="mb-8 text-3xl font-bold">{dict.nav.faq}</h1>
      <FaqAccordion items={items ?? []} searchPlaceholder={dict.faq_search} />
    </section>
  );
}
