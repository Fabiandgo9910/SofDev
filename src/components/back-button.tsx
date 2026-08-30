"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={label}
      className="focus-ring glass-panel fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-1 active:scale-95"
    >
      <ArrowLeft size={20} />
    </button>
  );
}
