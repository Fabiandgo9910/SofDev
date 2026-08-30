"use client";

import { useEffect, useState } from "react";
import { GlassButton } from "./glass/glass-button";
import { createClient } from "@/lib/supabase/client";

type Dict = {
  message: string;
  accept: string;
  reject: string;
  customize: string;
};

function getOrCreateVisitorId() {
  const key = "sofdev-visitor-id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

export function CookieBanner({ dict }: { dict: Dict }) {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem("sofdev-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  async function saveConsent(payload: { necessary: true; analytics: boolean; marketing: boolean }) {
    window.localStorage.setItem("sofdev-cookie-consent", JSON.stringify(payload));
    setVisible(false);
    try {
      const supabase = createClient();
      await supabase.from("cookie_consents").insert({
        visitor_id: getOrCreateVisitorId(),
        necessary: true,
        analytics: payload.analytics,
        marketing: payload.marketing,
      });
    } catch {
      // El registro del consentimiento es best-effort; no debe bloquear la navegación del usuario.
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-5">
        <p className="mb-4 text-sm">{dict.message}</p>

        {customizing && (
          <div className="mb-4 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked disabled className="h-4 w-4" />
              Necesarias (siempre activas)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4"
              />
              Analíticas
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="h-4 w-4"
              />
              Marketing
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <GlassButton onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}>
            {dict.accept}
          </GlassButton>
          <GlassButton
            variant="ghost"
            onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })}
          >
            {dict.reject}
          </GlassButton>
          {!customizing && (
            <GlassButton variant="ghost" onClick={() => setCustomizing(true)}>
              {dict.customize}
            </GlassButton>
          )}
          {customizing && (
            <GlassButton onClick={() => saveConsent({ necessary: true, analytics, marketing })}>
              Guardar preferencias
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
}
