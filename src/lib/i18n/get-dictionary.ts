import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] ?? dictionaries.es;
  return loader();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
