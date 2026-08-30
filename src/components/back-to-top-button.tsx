"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="focus-ring glass-panel fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-1 active:scale-95"
    >
      <ArrowUp size={20} />
    </button>
  );
}
