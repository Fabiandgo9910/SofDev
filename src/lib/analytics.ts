"use client";

import { createClient } from "@/lib/supabase/client";

function hasTrackingConsent(): boolean {
  try {
    const raw = window.localStorage.getItem("sofdev-cookie-consent");
    if (!raw) return false;
    const consent = JSON.parse(raw) as { analytics?: boolean; marketing?: boolean };
    return Boolean(consent.analytics || consent.marketing);
  } catch {
    return false;
  }
}

/**
 * Registra un evento de marketing/analítica en Supabase (tabla marketing_events).
 * Best-effort: nunca lanza ni bloquea la interacción del usuario, y respeta
 * el consentimiento de cookies (no envía nada si el usuario no ha aceptado
 * analítica ni marketing en el banner de cookies).
 */
export function trackEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (!hasTrackingConsent()) return;

  const supabase = createClient();

  (async () => {
    try {
      await supabase.from("marketing_events").insert({
        event_name: eventName,
        page_path: window.location.pathname,
        locale: document.documentElement.lang || null,
        metadata,
      });
    } catch {
      // best-effort: nunca debe romper la interacción del usuario
    }
  })();
}
