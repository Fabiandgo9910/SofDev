"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  event: string;
  metadata?: Record<string, unknown>;
};

export function TrackedAnchor({ children, event, metadata, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, metadata);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
