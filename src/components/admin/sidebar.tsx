"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
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
  { href: "/admin/faq", label: "Preguntas frecuentes" },
  { href: "/admin/leads", label: "Mensajes de contacto" },
  { href: "/admin/settings", label: "Contacto rápido (llamada / WhatsApp / email)" },
];

export function AdminSidebar({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const allLinks = isSuperAdmin ? [...LINKS, { href: "/admin/users", label: "Usuarios (super admin)" }] : LINKS;

  return (
    <>
      {/* Barra superior solo visible en móvil/tablet */}
      <div className="glass-panel sticky top-0 z-40 m-3 flex items-center justify-between rounded-2xl px-4 py-3 lg:hidden">
        <p className="text-base font-bold">
          Sof<span className="text-brand-500">Dev</span> Admin
        </p>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú de administración"
          aria-expanded={open}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-500/10"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Fondo oscuro al abrir el menú en móvil */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "glass-panel fixed inset-y-0 left-0 z-50 m-3 flex w-72 max-w-[85vw] flex-col rounded-2xl p-4 transition-transform duration-300 ease-in-out",
          "lg:sticky lg:inset-auto lg:top-3 lg:m-4 lg:h-[calc(100vh-1.5rem)] lg:w-64 lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
        )}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <p className="text-lg font-bold">
            Sof<span className="text-brand-500">Dev</span> Admin
          </p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full hover:bg-brand-500/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "focus-ring rounded-xl px-3 py-2 text-sm transition-colors hover:bg-brand-500/10",
                pathname === link.href && "bg-brand-500/15 font-medium"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleSignOut}
          className="focus-ring mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </aside>
    </>
  );
}
