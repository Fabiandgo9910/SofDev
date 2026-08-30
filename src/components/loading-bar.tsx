"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full bg-transparent"
    >
      <div
        className={`h-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-500 ease-out ${
          visible ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
