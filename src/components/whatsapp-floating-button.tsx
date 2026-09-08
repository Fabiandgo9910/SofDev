import { WhatsAppBadge } from "./icons/whatsapp-badge";
import { getContactInfo } from "./contact-quick-actions";
import { TrackedAnchor } from "./analytics/tracked-anchor";

export async function WhatsAppFloatingButton({ label }: { label: string }) {
  const info = await getContactInfo();
  if (!info?.whatsapp_number) return null;

  const whatsappUrl = `https://wa.me/${info.whatsapp_number}?text=${encodeURIComponent(
    info.whatsapp_default_message ?? ""
  )}`;

  return (
    <TrackedAnchor
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      event="whatsapp_floating_click"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center transition-transform hover:scale-110 active:scale-95"
    >
      <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <WhatsAppBadge size="lg" className="relative shadow-lg shadow-[#25D366]/40" />
    </TrackedAnchor>
  );
}
