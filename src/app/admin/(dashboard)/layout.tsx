import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El middleware ya bloquea el acceso sin sesión; esto es una segunda capa de defensa
  // para renderizar la UI correcta según el rol.
  let isSuperAdmin = false;
  let displayName = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    isSuperAdmin = profile?.role === "super_admin";
    displayName = profile?.full_name ?? user.email ?? "";
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />
      <div className="flex-1 p-6">
        {user && <p className="mb-4 text-right text-sm opacity-70">Sesión: {displayName}</p>}
        {children}
      </div>
    </div>
  );
}
