import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ContactForm } from "./contact-form";

export async function generateMetadata() {
  return { title: "Contáctanos" };
}

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">{dict.nav.contact}</h1>
      <ContactForm dict={dict.contact_form} locale={params.locale} />
    </section>
  );
}
