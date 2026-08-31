import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  icon: Icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  icon?: LucideIcon;
}) {
  return (
    <Reveal className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <div className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500 ${align === "center" ? "justify-center" : "justify-start"}`}>
          {Icon && (
            <span className="glass-panel flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
              <Icon size={14} />
            </span>
          )}
          <span className="truncate">{eyebrow}</span>
          <span aria-hidden="true" className="eyebrow-underline" />
        </div>
      )}
      <h2 className="line-clamp-2 break-words text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 line-clamp-3 break-words opacity-75 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
