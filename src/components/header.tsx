"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
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
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        <Link href={`/${locale}`} className="text-lg font-bold tracking-tight">
          Sof<span className="text-brand-500">Dev</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <select
            aria-label="Cambiar idioma"
            value={locale}
            onChange={(e) => switchLocale(e.target.value as Locale)}
            className="focus-ring glass-panel rounded-full px-3 py-2 text-sm"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </select>
          <ThemeToggle />
          <Link
            href={`/${locale}#contacto`}
            className="hidden rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-medium text-white shadow-md sm:inline-block"
          >
            {dict.nav.contact}
          </Link>
          <button
            className="focus-ring glass-panel flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
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
          className="glass-panel mx-auto mt-2 flex max-w-6xl flex-col gap-3 rounded-2xl p-5 lg:hidden"
          aria-label="Navegación móvil"
        >
          {[...links, { href: `/${locale}#contacto`, label: dict.nav.contact }].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="focus-ring text-sm font-medium">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
