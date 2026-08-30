"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/content", label: "Contenido (Hero / Quiénes somos)" },
  { href: "/admin/team", label: "Equipo" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/projects", label: "Proyectos" },
  { href: "/admin/partners", label: "Empresas" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/reviews", label: "Reseñas" },
  { href: "/admin/leads", label: "Mensajes de contacto" },
];

export function AdminSidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="glass-panel m-4 flex w-64 shrink-0 flex-col rounded-2xl p-4">
      <p className="mb-6 px-2 text-lg font-bold">
        Sof<span className="text-brand-500">Dev</span> Admin
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "focus-ring rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand-500/10",
              pathname === link.href && "bg-brand-500/15 font-medium"
            )}
          >
            {link.label}
          </Link>
        ))}
        {isSuperAdmin && (
          <Link
            href="/admin/users"
            className={cn(
              "focus-ring rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand-500/10",
              pathname === "/admin/users" && "bg-brand-500/15 font-medium"
            )}
          >
            Usuarios (super admin)
          </Link>
        )}
      </nav>
      <button
        onClick={handleSignOut}
        className="focus-ring mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </aside>
  );
}
