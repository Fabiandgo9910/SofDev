"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = LinkProps & {
  children: ReactNode;
  className?: string;
  event: string;
  metadata?: Record<string, unknown>;
};

export function TrackedLink({ children, event, metadata, ...props }: Props) {
  return (
    <Link {...props} onClick={() => trackEvent(event, metadata)}>
      {children}
    </Link>
  );
}
