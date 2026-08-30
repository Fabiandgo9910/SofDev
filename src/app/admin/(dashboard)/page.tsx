import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [{ count: leads }, { count: posts }, { count: projects }, { count: team }] = await Promise.all([
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Mensajes de contacto", value: leads ?? 0 },
    { label: "Publicaciones de blog", value: posts ?? 0 },
    { label: "Proyectos", value: projects ?? 0 },
    { label: "Miembros del equipo", value: team ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Panel de administración</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label}>
            <p className="text-3xl font-bold text-brand-500">{stat.value}</p>
            <p className="mt-1 text-sm opacity-70">{stat.label}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
