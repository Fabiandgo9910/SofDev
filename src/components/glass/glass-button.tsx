"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function GlassButton({ children, className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "focus-ring relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:brightness-110",
        variant === "ghost" && "glass-panel hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
