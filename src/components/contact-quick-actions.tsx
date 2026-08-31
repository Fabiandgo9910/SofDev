import { Mail, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassButton } from "./glass/glass-button";
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
  labels?: { call: string; whatsapp: string; email: string };
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
            className="focus-ring glass-panel flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
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
    <div className="flex flex-wrap justify-center gap-4">
      {info.phone_number && (
        <TrackedAnchor href={`tel:${info.phone_number.replace(/\s+/g, "")}`} event="call_click">
          <GlassButton variant="ghost">
            <Phone size={18} /> <span className="truncate">{labels?.call ?? "Llamar"} · {info.phone_number}</span>
          </GlassButton>
        </TrackedAnchor>
      )}
      {whatsappUrl && (
        <TrackedAnchor href={whatsappUrl} target="_blank" rel="noopener noreferrer" event="whatsapp_click">
          <GlassButton variant="ghost">
            <MessageCircle size={18} /> {labels?.whatsapp ?? "WhatsApp"}
          </GlassButton>
        </TrackedAnchor>
      )}
      {info.contact_email && (
        <TrackedAnchor href={`mailto:${info.contact_email}`} event="email_click">
          <GlassButton variant="ghost">
            <Mail size={18} /> <span className="truncate">{labels?.email ?? "Email"} · {info.contact_email}</span>
          </GlassButton>
        </TrackedAnchor>
      )}
    </div>
  );
}
