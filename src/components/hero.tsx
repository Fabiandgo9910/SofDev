import Link from "next/link";
import { GlassButton } from "./glass/glass-button";
import type { Locale } from "@/lib/i18n/config";

export function Hero({
  locale,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
      {/* Blobs decorativos animados */}
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 animate-floaty rounded-full bg-brand-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 h-96 w-96 animate-floaty rounded-full bg-brand-500/30 blur-3xl [animation-delay:2s]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-brand-600 to-brand-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80 sm:text-xl">{subtitle}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href={`/${locale}/contacto`}>
            <GlassButton>{ctaPrimary}</GlassButton>
          </Link>
          <Link href={`/${locale}/servicios`}>
            <GlassButton variant="ghost">{ctaSecondary}</GlassButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
