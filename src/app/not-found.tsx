import Link from "next/link";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <GlassCard className="max-w-md text-center">
        <p className="text-6xl font-bold text-brand-500">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Página no encontrada</h1>
        <p className="mt-2 opacity-80">
          El contenido que buscas no existe o fue movido de lugar.
        </p>
        <Link href="/es" className="mt-6 inline-block">
          <GlassButton>Volver al inicio</GlassButton>
        </Link>
      </GlassCard>
    </div>
  );
}
