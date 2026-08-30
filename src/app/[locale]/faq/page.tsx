"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";

const FAQ_ITEMS: { question: string; answer: string }[] = [
  { question: "¿Qué servicios ofrece SofDev?", answer: "Consultoría, diseño y desarrollo de soluciones digitales a medida: webs, aplicaciones, automatizaciones y más." },
  { question: "¿Cuánto tarda un proyecto típico?", answer: "Depende del alcance; tras la primera reunión te damos un cronograma estimado y claro." },
  { question: "¿Trabajan con empresas de cualquier tamaño?", answer: "Sí, adaptamos el alcance y el presupuesto a startups, pymes y grandes empresas." },
  { question: "¿Ofrecen mantenimiento después del lanzamiento?", answer: "Sí, ofrecemos planes de soporte y mantenimiento continuo tras la entrega." },
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      FAQ_ITEMS.filter(
        (item) =>
          item.question.toLowerCase().includes(query.toLowerCase()) ||
          item.answer.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">Preguntas frecuentes</h1>
      <input
        type="search"
        placeholder="Buscar en las preguntas frecuentes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="focus-ring glass-panel mb-6 w-full rounded-xl px-4 py-3"
        aria-label="Buscar en las preguntas frecuentes"
      />
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <GlassCard key={item.question} hover={false} className="!p-0">
            <button
              type="button"
              className="focus-ring flex w-full items-center justify-between px-6 py-4 text-left"
              aria-expanded={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{item.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === index && <p className="px-6 pb-4 text-sm opacity-80">{item.answer}</p>}
          </GlassCard>
        ))}
        {!filtered.length && <p className="opacity-70">No se encontraron resultados.</p>}
      </div>
    </section>
  );
}
