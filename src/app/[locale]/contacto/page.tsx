import { MessageSquare } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ContactForm } from "@/components/contact-form";
import { ContactQuickActions } from "@/components/contact-quick-actions";
import { SectionHeading } from "@/components/section-heading";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return buildMetadata({ locale: params.locale, path: "/contacto", title: "Contáctanos", description: "Ponte en contacto con SofDev: llamada, WhatsApp, email o formulario." });
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading eyebrow={dict.nav.contact} title={dict.nav.contact} subtitle={dict.contact_quick.intro} icon={MessageSquare} align="left" />

      <div className="mt-10">
        <ContactQuickActions
          labels={{
            call: dict.contact_quick.call,
            whatsapp: dict.contact_quick.whatsapp,
            email: dict.contact_quick.email,
            whatsappHint: dict.contact_quick.whatsapp_hint,
          }}
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="glass-panel h-full rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{dict.contact_quick.how_it_works}</p>
          <ol className="mt-5 space-y-6">
            {dict.contact_quick.steps.map((step, i) => (
              <li key={step} className="relative flex items-start gap-3">
                {i < dict.contact_quick.steps.length - 1 && (
                  <span aria-hidden="true" className="absolute left-4 top-9 h-[calc(100%-0.75rem)] w-px bg-brand-500/20" />
                )}
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-sm font-semibold text-brand-500">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm opacity-80">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <ContactForm dict={dict.contact_form} locale={params.locale} />
      </div>
    </section>
  );
}
