import { Mail, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { WhatsAppBadge } from "./icons/whatsapp-badge";
import { TrackedAnchor } from "./analytics/tracked-anchor";

export async function getContactInfo() {
  const supabase = createClient();
  const { data } = await supabase
    .from("contact_info")
    .select("phone_number, whatsapp_number, whatsapp_default_message, contact_email")
    .eq("id", true)
    .maybeSingle();
  return data;
}

export async function ContactQuickActions({
  variant = "full",
  labels,
}: {
  variant?: "full" | "compact";
  labels?: { call: string; whatsapp: string; email: string; whatsappHint?: string };
}) {
  const info = await getContactInfo();
  if (!info) return null;

  const whatsappUrl = info.whatsapp_number
    ? `https://wa.me/${info.whatsapp_number}?text=${encodeURIComponent(info.whatsapp_default_message ?? "")}`
    : null;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        {info.phone_number && (
          <TrackedAnchor
            href={`tel:${info.phone_number.replace(/\s+/g, "")}`}
            aria-label={labels?.call ?? "Llamar"}
            event="call_click"
            className="focus-ring glass-panel flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <Phone size={16} />
          </TrackedAnchor>
        )}
        {whatsappUrl && (
          <TrackedAnchor
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels?.whatsapp ?? "WhatsApp"}
            event="whatsapp_click"
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/12 text-[#128C7E] transition-transform hover:scale-110 dark:text-[#25D366]"
          >
            <MessageCircle size={16} />
          </TrackedAnchor>
        )}
        {info.contact_email && (
          <TrackedAnchor
            href={`mailto:${info.contact_email}`}
            aria-label={labels?.email ?? "Email"}
            event="email_click"
            className="focus-ring glass-panel flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <Mail size={16} />
          </TrackedAnchor>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {info.phone_number && (
        <TrackedAnchor
          href={`tel:${info.phone_number.replace(/\s+/g, "")}`}
          event="call_click"
          className="focus-ring glass-panel group flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 transition-transform group-hover:scale-110">
            <Phone size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{labels?.call ?? "Llamar"}</p>
            <p className="mt-0.5 truncate text-xs opacity-70">{info.phone_number}</p>
          </div>
        </TrackedAnchor>
      )}

      {/* Tarjeta de WhatsApp: la más llamativa de las tres — color de marca,
          halo pulsante y ligeramente elevada para guiar el ojo hacia el
          canal de contacto más directo. */}
      {whatsappUrl && (
        <TrackedAnchor
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          event="whatsapp_click"
          className="focus-ring group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-[#25D366]/30 bg-gradient-to-b from-[#25D366]/15 via-[#25D366]/5 to-transparent p-5 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#25D366]/20 sm:scale-[1.04]"
        >
          <span
            aria-hidden="true"
            className="absolute -right-6 -top-6 h-24 w-24 animate-pulse-glow rounded-full bg-[#25D366]/25 blur-2xl"
          />
          <WhatsAppBadge size="md" className="shadow-lg shadow-[#25D366]/30 transition-transform group-hover:scale-110" />
          <div className="relative min-w-0">
            <p className="text-sm font-semibold text-[#128C7E] dark:text-[#25D366]">{labels?.whatsapp ?? "WhatsApp"}</p>
            <p className="mt-0.5 truncate text-xs opacity-70">{labels?.whatsappHint ?? "Respuesta más rápida"}</p>
          </div>
        </TrackedAnchor>
      )}

      {info.contact_email && (
        <TrackedAnchor
          href={`mailto:${info.contact_email}`}
          event="email_click"
          className="focus-ring glass-panel group flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500 transition-transform group-hover:scale-110">
            <Mail size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{labels?.email ?? "Email"}</p>
            <p className="mt-0.5 truncate text-xs opacity-70">{info.contact_email}</p>
          </div>
        </TrackedAnchor>
      )}
    </div>
  );
}
