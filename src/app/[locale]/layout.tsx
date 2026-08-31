import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { BackToTopButton } from "@/components/back-to-top-button";
import { BackButton } from "@/components/back-button";
import { LoadingBar } from "@/components/loading-bar";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  return {
    // OJO: no fijamos aquí 'alternates.canonical' a propósito — si se define a
    // nivel de layout, TODAS las páginas heredarían el mismo canonical (el
    // de la home), lo cual es incorrecto para SEO. Cada página define el suyo
    // propio en su generateMetadata.
    openGraph: {
      siteName: "SofDev",
      locale: params.locale,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = createClient();
  const [{ data: contactInfo }, { data: reviews }] = await Promise.all([
    supabase.from("contact_info").select("phone_number, contact_email").eq("id", true).maybeSingle(),
    supabase.from("google_reviews").select("rating"),
  ]);

  const ratingCount = reviews?.length ?? 0;
  const averageRating =
    ratingCount > 0 ? reviews!.reduce((sum, r) => sum + (r.rating as number), 0) / ratingCount : null;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "SofDev",
    url: siteUrl,
    description: "Consultoría tecnológica: diseño y desarrollo de soluciones digitales a medida.",
    ...(contactInfo?.phone_number ? { telephone: contactInfo.phone_number } : {}),
    ...(contactInfo?.contact_email ? { email: contactInfo.contact_email } : {}),
    ...(averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: ratingCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <LoadingBar />
      <PageViewTracker />
      <Header locale={params.locale} dict={dict} />
      {/* Espaciador: compensa la altura del header, que ahora es 'fixed' y
          no reserva espacio propio en el flujo normal del documento. */}
      <div aria-hidden="true" className="h-[76px] sm:h-[88px]" />
      <main id="main-content">{children}</main>
      <Footer locale={params.locale} dict={dict} />
      <BackButton label={dict.back} />
      <BackToTopButton label={dict.back_to_top} />
      <WhatsAppFloatingButton label="WhatsApp" />
      <CookieBanner dict={dict.cookies} />
    </>
  );
}
