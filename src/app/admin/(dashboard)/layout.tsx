import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = { robots: { index: false, follow: false } };

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
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar isSuperAdmin={isSuperAdmin} />
      <div className="min-w-0 flex-1 p-4 sm:p-6">
        {user && <p className="mb-4 truncate text-right text-sm opacity-70">Sesión: {displayName}</p>}
        {children}
      </div>
    </div>
  );
}
