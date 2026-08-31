"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";

export type FaqItem = { id: string; question: string; answer: string };

export function FaqAccordion({
  items,
  searchPlaceholder,
  showSearch = true,
}: {
  items: FaqItem[];
  searchPlaceholder: string;
  showSearch?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          item.question.toLowerCase().includes(query.toLowerCase()) ||
          item.answer.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  return (
    <div>
      {showSearch && (
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="focus-ring glass-panel mb-6 w-full rounded-xl px-4 py-3"
          aria-label={searchPlaceholder}
        />
      )}
      <div className="space-y-3">
        {filtered.map((item) => (
          <GlassCard key={item.id} hover={false} className="!p-0">
            <button
              type="button"
              className="focus-ring flex w-full items-center justify-between px-6 py-4 text-left"
              aria-expanded={openId === item.id}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <span className="line-clamp-2 break-words font-medium">{item.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform ${openId === item.id ? "rotate-180" : ""}`}
              />
            </button>
            {openId === item.id && <p className="px-6 pb-4 text-sm opacity-80">{item.answer}</p>}
          </GlassCard>
        ))}
        {!filtered.length && <p className="opacity-70">No se encontraron resultados.</p>}
      </div>
    </div>
  );
}
