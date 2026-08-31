import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";
import { currentYear } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return buildMetadata({ locale: params.locale, path: "/privacidad", title: "Política de privacidad", description: "Cómo tratamos tus datos personales en SofDev." });
}

export default async function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: content } = await supabase
    .from("site_content")
    .select("title, body")
    .eq("section_key", "privacidad")
    .eq("locale", params.locale)
    .maybeSingle();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <GlassCard>
        <h1 className="text-3xl font-bold">{content?.title ?? dict.footer.privacy}</h1>
        <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line dark:prose-invert">
          {content?.body ??
            `Última actualización: ${currentYear()}.\n\nSofDev recopila y trata datos personales (nombre, email, teléfono y mensaje) exclusivamente para responder a solicitudes de contacto y, con tu consentimiento, para fines analíticos y de marketing. No compartimos tus datos con terceros salvo obligación legal. Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a través del formulario de contacto. Este texto es editable desde el panel de administración.`}
        </div>
      </GlassCard>
    </section>
  );
}
