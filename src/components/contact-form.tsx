"use client";

import { useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { GlassButton } from "@/components/glass/glass-button";
import { GlassCard } from "@/components/glass/glass-card";
import { trackEvent } from "@/lib/analytics";

type Dict = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
};

export function ContactForm({ dict, locale }: { dict: Dict; locale: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      message: formData.get("message"),
      website: formData.get("website"), // honeypot
      turnstileToken,
      sourcePage: `/${locale}/contacto`,
      utmSource: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
      utmMedium: new URLSearchParams(window.location.search).get("utm_medium") ?? undefined,
      utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? undefined,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "error");
      }

      setStatus("success");
      trackEvent("contact_form_submit", { locale });
      (e.target as HTMLFormElement).reset();
      setTurnstileToken("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : dict.error);
    }
  }

  return (
    <GlassCard>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => {
          // @ts-expect-error -- turnstile se inyecta globalmente por el script externo
          window.turnstile?.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => setTurnstileToken(token),
          });
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot: invisible para humanos, los bots suelen rellenarlo */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px]"
          aria-hidden="true"
        />

        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
            {dict.name}
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            className="focus-ring glass-panel w-full rounded-xl px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            {dict.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="focus-ring glass-panel w-full rounded-xl px-4 py-3"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              {dict.phone}
            </label>
            <input id="phone" name="phone" className="focus-ring glass-panel w-full rounded-xl px-4 py-3" />
          </div>
          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium">
              {dict.company}
            </label>
            <input id="company" name="company" className="focus-ring glass-panel w-full rounded-xl px-4 py-3" />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium">
            {dict.message}
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={5}
            className="focus-ring glass-panel w-full rounded-xl px-4 py-3"
          />
        </div>

        <div ref={turnstileRef} />

        <GlassButton type="submit" disabled={status === "sending"}>
          {status === "sending" ? dict.sending : dict.submit}
        </GlassButton>

        {status === "success" && <p className="text-sm text-green-600">{dict.success}</p>}
        {status === "error" && <p className="text-sm text-red-600">{errorMsg ?? dict.error}</p>}
      </form>
    </GlassCard>
  );
}
