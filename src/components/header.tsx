"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LOCALES, LOCALE_SHORT_LABELS, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: { href: string; label: string }[] = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#nosotros`, label: dict.nav.about },
    { href: `/${locale}#equipo`, label: dict.nav.team },
    { href: `/${locale}#servicios`, label: dict.nav.services },
    { href: `/${locale}#proyectos`, label: dict.nav.projects },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}#resenas`, label: dict.nav.reviews },
    { href: `/${locale}#faq`, label: dict.nav.faq },
  ];

  function switchLocale(newLocale: Locale) {
    const rest = pathname.replace(`/${locale}`, "") || "/";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.href = `/${newLocale}${rest === "/" ? "" : rest}`;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-2 pt-3 sm:px-4 sm:pt-4">
      <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
        <Link href={`/${locale}`} className="shrink-0 text-base font-bold tracking-tight sm:text-lg">
          Sof<span className="text-brand-500">Dev</span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring whitespace-nowrap text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <select
            aria-label="Cambiar idioma"
            value={locale}
            onChange={(e) => switchLocale(e.target.value as Locale)}
            className="focus-ring glass-panel w-[3.75rem] rounded-full px-2 py-2 text-xs sm:w-auto sm:px-3 sm:text-sm"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {LOCALE_SHORT_LABELS[l]}
              </option>
            ))}
          </select>
          <ThemeToggle />
          <Link
            href={`/${locale}#contacto`}
            className="hidden whitespace-nowrap rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-medium text-white shadow-md md:inline-block"
          >
            {dict.nav.contact}
          </Link>
          <button
            className="focus-ring glass-panel flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 xl:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="glass-panel mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-4 sm:p-5 xl:hidden"
          aria-label="Navegación móvil"
        >
          {[...links, { href: `/${locale}#contacto`, label: dict.nav.contact }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-brand-500/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
