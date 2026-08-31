import { ArrowDown, Rocket, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { GlassButton } from "./glass/glass-button";
import { TrackedLink } from "./analytics/tracked-link";
import type { Locale } from "@/lib/i18n/config";

const FEATURES = [
  { icon: Wand2, label: "Diseño a medida" },
  { icon: Rocket, label: "Entrega ágil" },
  { icon: ShieldCheck, label: "Soporte continuo" },
];

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
    <section className="relative overflow-x-hidden px-6 pb-16 pt-20 sm:pb-24 sm:pt-32">
      {/* Fondo decorativo: rejilla + anillo + blobs de color, se desvanecen
          gradualmente más allá de la sección (sin corte brusco). */}
      <div aria-hidden="true" className="bg-grid-pattern absolute inset-x-0 top-0 h-[160%]" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-brand-300/20 opacity-60 sm:h-[36rem] sm:w-[36rem]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-72 w-72 animate-floaty rounded-full bg-brand-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-24 h-96 w-96 animate-floaty rounded-full bg-amber-300/20 blur-3xl [animation-delay:2s]"
      />
      <div
        aria-hidden="true"
        className="absolute right-1/3 top-1/3 h-40 w-40 animate-floaty rounded-full bg-brand-500/20 blur-3xl [animation-delay:4s]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <div
          className="animate-fade-in-up glass-panel mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
          style={{ animationDelay: "0ms" }}
        >
          <Sparkles size={14} className="shrink-0 text-brand-500" />
          <span className="max-w-[70vw] truncate sm:max-w-none">{eyebrow ?? "Consultoría tecnológica"}</span>
        </div>

        <h1
          className="animate-fade-in-up text-balance break-words text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.1] tracking-tight"
          style={{ animationDelay: "80ms" }}
        >
          <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p
          className="animate-fade-in-up text-balance mx-auto mt-6 line-clamp-4 max-w-2xl break-words text-base opacity-80 sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          {subtitle}
        </p>

        <div
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <TrackedLink href={`/${locale}#contacto`} event="hero_cta_primary_click">
            <GlassButton className="animate-pulse-glow">{ctaPrimary}</GlassButton>
          </TrackedLink>
          <TrackedLink href={`/${locale}#servicios`} event="hero_cta_secondary_click">
            <GlassButton variant="ghost">{ctaSecondary}</GlassButton>
          </TrackedLink>
        </div>

        <ul
          className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          style={{ animationDelay: "320ms" }}
        >
          {FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-sm opacity-70">
              <Icon size={15} className="text-brand-500" />
              {label}
            </li>
          ))}
        </ul>
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
