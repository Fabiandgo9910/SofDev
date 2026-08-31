import type { Metadata } from "next";
import { LOCALES, type Locale } from "./i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Construye metadatos SEO consistentes para una página del sitio público:
 * canonical autorreferenciado (nunca apunta a otra página), hreflang para
 * los 4 idiomas y Open Graph básico. Cada página debe llamar a esto desde
 * su propio generateMetadata pasando su `path` relativo (sin el locale).
 */
export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  images,
}: {
  locale: Locale;
  path?: string; // ej: "/servicios", "/blog/mi-post", "" para la home
  title: string;
  description?: string;
  images?: string[];
}): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      ...(images?.length ? { images } : {}),
    },
  };
}

/** Genera el JSON-LD de tipo FAQPage a partir de una lista de preguntas/respuestas. */
export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
