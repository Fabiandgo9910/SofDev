"use client";

import { useEffect, useState, type FormEvent } from "react";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";

type UserProfile = {
  id: string;
  full_name: string;
  role: "super_admin" | "admin" | "editor";
  is_active: boolean;
  created_at: string;
};

const ROLE_LABELS: Record<UserProfile["role"], string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    else setError(data.message);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInviting(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        fullName: formData.get("fullName"),
        role: formData.get("role"),
      }),
    });
    const data = await res.json();
    setInviting(false);

    if (!res.ok) {
      setError(data.message ?? "No se pudo invitar al usuario.");
      return;
    }

    (e.target as HTMLFormElement).reset();
    load();
  }

  async function handleRoleChange(id: string, role: UserProfile["role"]) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    load();
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Usuarios y roles</h1>

      <GlassCard className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Invitar nuevo usuario</h2>
        <form onSubmit={handleInvite} className="grid gap-4 sm:grid-cols-2">
          <input name="fullName" placeholder="Nombre completo" required className="focus-ring glass-panel rounded-xl px-4 py-2" />
          <input name="email" type="email" placeholder="Correo electrónico" required className="focus-ring glass-panel rounded-xl px-4 py-2" />
          <select name="role" required defaultValue="editor" className="focus-ring glass-panel rounded-xl px-4 py-2">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>
          <GlassButton type="submit" disabled={inviting}>
            {inviting ? "Enviando invitación..." : "Invitar"}
          </GlassButton>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </GlassCard>

      <GlassCard hover={false} className="overflow-x-auto !p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium opacity-70">Nombre</th>
              <th className="px-4 py-3 font-medium opacity-70">Rol</th>
              <th className="px-4 py-3 font-medium opacity-70">Activo</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center opacity-60">
                  Cargando...
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="px-4 py-3">{u.full_name}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserProfile["role"])}
                    className="focus-ring glass-panel rounded-xl px-3 py-1"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={u.is_active}
                    onChange={(e) => handleToggleActive(u.id, e.target.checked)}
                    className="h-5 w-5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
