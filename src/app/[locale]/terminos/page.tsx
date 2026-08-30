import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";
import { currentYear } from "@/lib/utils";

export async function generateMetadata() {
  return { title: "Términos y condiciones" };
}

export default async function TermsPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: content } = await supabase
    .from("site_content")
    .select("title, body")
    .eq("section_key", "terminos")
    .eq("locale", params.locale)
    .maybeSingle();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <GlassCard>
        <h1 className="text-3xl font-bold">{content?.title ?? dict.footer.terms}</h1>
        <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line dark:prose-invert">
          {content?.body ??
            `Última actualización: ${currentYear()}.\n\nEl acceso y uso del sitio web de SofDev implica la aceptación de estos términos. El contenido del sitio es propiedad de SofDev salvo indicación contraria. Este texto es editable desde el panel de administración.`}
        </div>
      </GlassCard>
    </section>
  );
}
