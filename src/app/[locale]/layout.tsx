import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieBanner } from "@/components/cookie-banner";
import { BackToTopButton } from "@/components/back-to-top-button";
import { BackButton } from "@/components/back-button";
import { LoadingBar } from "@/components/loading-bar";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    alternates: {
      canonical: `${siteUrl}/${params.locale}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      siteName: "SofDev",
      locale: params.locale,
      type: "website",
      url: `${siteUrl}/${params.locale}`,
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

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SofDev",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    description: "Consultoría tecnológica: diseño y desarrollo de soluciones digitales a medida.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <LoadingBar />
      <Header locale={params.locale} dict={dict} />
      <main id="main-content">{children}</main>
      <Footer locale={params.locale} dict={dict} />
      <BackButton label={dict.back} />
      <BackToTopButton label={dict.back_to_top} />
      <CookieBanner dict={dict.cookies} />
    </>
  );
}
