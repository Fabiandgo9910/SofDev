import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import { GlassButton } from "./glass/glass-button";
import type { Locale } from "@/lib/i18n/config";

export function Hero({
  locale,
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 sm:pb-24 sm:pt-32">
      {/* Fondo decorativo: rejilla sutil + blobs animados */}
      <div aria-hidden="true" className="bg-grid-pattern absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 animate-floaty rounded-full bg-brand-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 h-96 w-96 animate-floaty rounded-full bg-brand-500/30 blur-3xl [animation-delay:2s]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="glass-panel mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
          <Sparkles size={14} className="text-brand-500 shrink-0" />
          <span className="max-w-[70vw] truncate sm:max-w-none">{eyebrow ?? "Consultoría tecnológica"}</span>
        </div>

        <h1 className="text-balance break-words text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.1] tracking-tight">
          <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p className="text-balance mx-auto mt-6 line-clamp-4 max-w-2xl break-words text-base opacity-80 sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href={`/${locale}#contacto`}>
            <GlassButton>{ctaPrimary}</GlassButton>
          </Link>
          <Link href={`/${locale}#servicios`}>
            <GlassButton variant="ghost">{ctaSecondary}</GlassButton>
          </Link>
        </div>
      </div>

      <div className="relative mt-16 flex justify-center">
        <a
          href="#nosotros"
          aria-label="Desplázate para ver más"
          className="focus-ring glass-panel flex h-10 w-10 animate-floaty items-center justify-center rounded-full text-brand-500"
        >
          <ArrowDown size={16} />
        </a>
      </div>
    </section>
  );
}
