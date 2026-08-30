import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
