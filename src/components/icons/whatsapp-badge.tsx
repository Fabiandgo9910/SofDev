import { MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { wrap: "h-9 w-9", icon: 16, dot: "h-4 w-4", dotIcon: 9 },
  md: { wrap: "h-12 w-12", icon: 22, dot: "h-5 w-5", dotIcon: 11 },
  lg: { wrap: "h-14 w-14", icon: 26, dot: "h-6 w-6", dotIcon: 13 },
} as const;

/**
 * Insignia visual de "WhatsApp": un círculo en el verde de marca con un
 * icono de chat y una pequeña insignia de teléfono superpuesta, para dar
 * una identidad reconocible sin depender de ningún paquete de iconos de
 * marca externo (no disponible sin conexión en este entorno).
 */
export function WhatsAppBadge({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white",
        s.wrap,
        className
      )}
    >
      <MessageCircle size={s.icon} />
      <span
        className={cn(
          "absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border-2 border-white bg-[#128C7E] text-white dark:border-[#0b0d1a]",
          s.dot
        )}
      >
        <Phone size={s.dotIcon} />
      </span>
    </span>
  );
}
