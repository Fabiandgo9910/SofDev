"use client";

import { useRef, type PointerEvent } from "react";
import { ArrowDown, Code2, LayoutGrid, Rocket, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { GlassButton } from "./glass/glass-button";
import { TrackedLink } from "./analytics/tracked-link";
import type { Locale } from "@/lib/i18n/config";

const FEATURE_ICONS = [Wand2, Rocket, ShieldCheck];

export function Hero({
  locale,
  eyebrow,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  features,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  features: string[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  // Halo que sigue al cursor (solo se activa en dispositivos con puntero fino,
  // ver media query "hover: hover" en globals.css). No afecta al scroll ni al layout.
  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <section className="relative isolate overflow-hidden rounded-b-[2.5rem] px-6 pb-20 pt-24 sm:rounded-b-[3.5rem] sm:pb-28 sm:pt-32">
      {/*
        Capa decorativa CONTENIDA dentro de los límites reales de esta sección
        (inset-0 + overflow-hidden sobre un contenedor con la misma altura que
        el Hero). Antes esta capa usaba una altura del 160% sobre un contenedor
        sin overflow-y controlado: al no tener límite, la rejilla y los blobs
        se extendían por debajo del Hero y se solapaban con la siguiente
        sección, generando esa sensación de "espacio de scroll muerto" /
        desajustado. Ahora queda perfectamente recortada al alto del Hero.
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3.5rem]">
        <div className="bg-grid-pattern absolute inset-0 opacity-80" />
        <div className="bg-grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/4 animate-breathe rounded-full border border-brand-300/20" />
        <div className="absolute -left-24 -top-24 h-72 w-72 animate-floaty rounded-full bg-brand-300/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 animate-floaty rounded-full bg-amber-300/20 blur-3xl [animation-delay:2s]" />
        <div className="absolute right-1/4 top-1/3 h-40 w-40 animate-floaty rounded-full bg-brand-500/20 blur-3xl [animation-delay:4s]" />
      </div>

      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        className="spotlight relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10"
      >
        {/* ---------- Columna de texto ---------- */}
        <div className="text-center lg:text-left">
          <div
            className="animate-fade-in-up glass-panel mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium lg:mx-0"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles size={14} className="shrink-0 text-brand-500" />
            <span className="max-w-[70vw] truncate sm:max-w-none">{eyebrow ?? "Consultoría tecnológica"}</span>
          </div>

          <h1
            className="animate-fade-in-up text-balance mx-auto mt-6 max-w-2xl break-words text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.1] tracking-tight lg:mx-0"
            style={{ animationDelay: "80ms" }}
          >
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-300 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <p
            className="animate-fade-in-up text-balance mx-auto mt-6 line-clamp-4 max-w-2xl break-words text-base opacity-80 sm:text-lg lg:mx-0"
            style={{ animationDelay: "160ms" }}
          >
            {subtitle}
          </p>

          <div
            className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            style={{ animationDelay: "240ms" }}
          >
            <TrackedLink href={`/${locale}#contacto`} event="hero_cta_primary_click">
              <GlassButton className="animate-pulse-glow">{ctaPrimary}</GlassButton>
            </TrackedLink>
            <TrackedLink href={`/${locale}#servicios`} event="hero_cta_secondary_click">
              <GlassButton variant="ghost">{ctaSecondary}</GlassButton>
            </TrackedLink>
          </div>

          {/* Chips de características: ahora son mini tarjetas de vidrio
              independientes en vez de un texto plano en lista. */}
          <ul
            className="animate-fade-in-up mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 lg:mx-0"
            style={{ animationDelay: "320ms" }}
          >
            {features.map((label, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <li
                  key={label}
                  className="glass-panel flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-transform duration-300 hover:-translate-y-0.5 sm:justify-start"
                >
                  <Icon size={16} className="shrink-0 text-brand-500" />
                  <span className="truncate opacity-85">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Panel decorativo tipo "producto" (glassmorphism) ---------- */}
        <div className="animate-rise-in relative mx-auto hidden w-full max-w-md lg:block" style={{ animationDelay: "200ms" }} aria-hidden="true">
          {/* Anillo orbital con un icono girando alrededor del panel */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0">
            <div className="animate-orbit absolute [--orbit-radius:11rem]">
              <div className="glass-panel flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-brand-500">
                <Code2 size={16} />
              </div>
            </div>
          </div>

          <div className="shimmer-border glass-panel-strong relative overflow-hidden rounded-3xl p-5">
            {/* Barra de "ventana" superior */}
            <div className="mb-5 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-auto flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-medium text-brand-500">
                <LayoutGrid size={11} /> SofDev
              </span>
            </div>

            {/* "Gráfico" decorativo hecho con barras de vidrio */}
            <div className="flex h-32 items-end justify-between gap-2.5 rounded-2xl bg-brand-500/5 p-4">
              {[38, 62, 45, 88, 55, 72, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-full animate-rise-in rounded-full bg-gradient-to-t from-brand-600 to-brand-300"
                  style={{ height: `${h}%`, animationDelay: `${300 + i * 80}ms` }}
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="glass-panel rounded-xl p-3">
                <div className="h-2 w-3/4 rounded-full bg-brand-500/30" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-brand-500/15" />
              </div>
              <div className="glass-panel rounded-xl p-3">
                <div className="h-2 w-2/3 rounded-full bg-brand-500/30" />
                <div className="mt-2 h-2 w-1/3 rounded-full bg-brand-500/15" />
              </div>
            </div>
          </div>

          {/* Insignia flotante */}
          <div className="glass-panel animate-floaty absolute -bottom-5 -left-6 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-medium [animation-delay:1s]">
            <ShieldCheck size={15} className="text-brand-500" />
            Next.js · Supabase · Vercel
          </div>
        </div>
      </div>

      {/* Indicador de scroll hacia la siguiente sección */}
      <div className="relative mt-14 flex justify-center lg:mt-20">
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
