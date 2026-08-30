import Link from "next/link";
import { currentYear } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 px-4 pb-10">
      <div className="glass-panel mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-2xl px-6 py-6 text-sm sm:flex-row">
        <p className="opacity-80">
          © {currentYear()} SofDev. {dict.footer.rights}
        </p>
        <div className="flex gap-6">
          <Link href={`/${locale}/privacidad`} className="focus-ring opacity-80 hover:opacity-100">
            {dict.footer.privacy}
          </Link>
          <Link href={`/${locale}/terminos`} className="focus-ring opacity-80 hover:opacity-100">
            {dict.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
