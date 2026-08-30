import { Mail, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassButton } from "./glass/glass-button";

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
          <a
            href={`tel:${info.phone_number.replace(/\s+/g, "")}`}
            aria-label={labels?.call ?? "Llamar"}
            className="focus-ring glass-panel flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <Phone size={16} />
          </a>
        )}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels?.whatsapp ?? "WhatsApp"}
            className="focus-ring glass-panel flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <MessageCircle size={16} />
          </a>
        )}
        {info.contact_email && (
          <a
            href={`mailto:${info.contact_email}`}
            aria-label={labels?.email ?? "Email"}
            className="focus-ring glass-panel flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
          >
            <Mail size={16} />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {info.phone_number && (
        <a href={`tel:${info.phone_number.replace(/\s+/g, "")}`}>
          <GlassButton variant="ghost">
            <Phone size={18} /> {labels?.call ?? "Llamar"} · {info.phone_number}
          </GlassButton>
        </a>
      )}
      {whatsappUrl && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <GlassButton variant="ghost">
            <MessageCircle size={18} /> {labels?.whatsapp ?? "WhatsApp"}
          </GlassButton>
        </a>
      )}
      {info.contact_email && (
        <a href={`mailto:${info.contact_email}`}>
          <GlassButton variant="ghost">
            <Mail size={18} /> {labels?.email ?? "Email"} · {info.contact_email}
          </GlassButton>
        </a>
      )}
    </div>
  );
}
