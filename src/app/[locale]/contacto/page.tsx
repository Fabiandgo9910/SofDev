import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ContactForm } from "@/components/contact-form";
import { ContactQuickActions } from "@/components/contact-quick-actions";

export async function generateMetadata() {
  return { title: "Contáctanos" };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold">{dict.nav.contact}</h1>
      <p className="mb-6 text-sm opacity-70">{dict.contact_quick.intro}</p>
      <div className="mb-8">
        <ContactQuickActions
          labels={{ call: dict.contact_quick.call, whatsapp: dict.contact_quick.whatsapp, email: dict.contact_quick.email }}
        />
      </div>
      <ContactForm dict={dict.contact_form} locale={params.locale} />
    </section>
  );
}
