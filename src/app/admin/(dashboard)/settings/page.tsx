"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";

type ContactInfo = {
  phone_number: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  contact_email: string;
};

const EMPTY: ContactInfo = {
  phone_number: "",
  whatsapp_number: "",
  whatsapp_default_message: "",
  contact_email: "",
};

export default function AdminSettingsPage() {
  const [values, setValues] = useState<ContactInfo>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("contact_info")
      .select("phone_number, whatsapp_number, whatsapp_default_message, contact_email")
      .eq("id", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setValues({ ...EMPTY, ...data });
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave() {
    setError(null);
    const { error: saveError } = await supabase
      .from("contact_info")
      .upsert({ id: true, ...values, updated_at: new Date().toISOString() }, { onConflict: "id" });

    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Contacto rápido</h1>
      <p className="mb-6 text-sm opacity-70">
        Estos datos se muestran en el botón de llamada, WhatsApp y correo del sitio público.
      </p>

      <GlassCard className="max-w-xl">
        {loading ? (
          <p className="opacity-60">Cargando...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Teléfono de llamada</label>
              <input
                placeholder="+34 900 000 000"
                value={values.phone_number}
                onChange={(e) => setValues({ ...values, phone_number: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Número de WhatsApp (solo dígitos, con prefijo de país, sin +)
              </label>
              <input
                placeholder="34900000000"
                value={values.whatsapp_number}
                onChange={(e) => setValues({ ...values, whatsapp_number: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mensaje inicial de WhatsApp</label>
              <input
                value={values.whatsapp_default_message}
                onChange={(e) => setValues({ ...values, whatsapp_default_message: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Correo de contacto</label>
              <input
                type="email"
                placeholder="contacto@sofdev.com"
                value={values.contact_email}
                onChange={(e) => setValues({ ...values, contact_email: e.target.value })}
                className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
              />
            </div>
            <GlassButton onClick={handleSave}>Guardar cambios</GlassButton>
            {saved && <p className="text-sm text-green-600">Guardado correctamente.</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
