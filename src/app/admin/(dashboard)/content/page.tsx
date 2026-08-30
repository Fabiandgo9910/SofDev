"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";

const SECTIONS = [
  { key: "hero", label: "Hero (portada)" },
  { key: "quienes_somos", label: "Quiénes somos" },
  { key: "privacidad", label: "Política de privacidad" },
  { key: "terminos", label: "Términos y condiciones" },
];

type ContentRow = { title: string; subtitle: string; body: string };

export default function AdminContentPage() {
  const [sectionKey, setSectionKey] = useState(SECTIONS[0].key);
  const [locale, setLocale] = useState<Locale>("es");
  const [values, setValues] = useState<ContentRow>({ title: "", subtitle: "", body: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSaved(false);
    supabase
      .from("site_content")
      .select("title, subtitle, body")
      .eq("section_key", sectionKey)
      .eq("locale", locale)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setValues({ title: data?.title ?? "", subtitle: data?.subtitle ?? "", body: data?.body ?? "" });
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey, locale]);

  async function handleSave() {
    await supabase.from("site_content").upsert(
      { section_key: sectionKey, locale, ...values, updated_at: new Date().toISOString() },
      { onConflict: "section_key,locale" }
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Contenido editable</h1>
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={sectionKey}
          onChange={(e) => setSectionKey(e.target.value)}
          className="focus-ring glass-panel rounded-xl px-4 py-2"
        >
          {SECTIONS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="focus-ring glass-panel rounded-xl px-4 py-2"
        >
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {LOCALE_LABELS[l]}
            </option>
          ))}
        </select>
      </div>

      <GlassCard>
        {loading ? (
          <p className="opacity-60">Cargando...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Título</label>
              <input
                value={values.title}
                onChange={(e) => setValues({ ...values, title: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Subtítulo</label>
              <input
                value={values.subtitle}
                onChange={(e) => setValues({ ...values, subtitle: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cuerpo</label>
              <textarea
                rows={10}
                value={values.body}
                onChange={(e) => setValues({ ...values, body: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <GlassButton onClick={handleSave}>Guardar cambios</GlassButton>
            {saved && <p className="text-sm text-green-600">Guardado correctamente.</p>}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
