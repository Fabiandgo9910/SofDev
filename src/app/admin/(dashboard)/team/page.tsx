"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminTeamPage() {
  return (
    <AdminCrudTable
      table="team_members"
      title="Equipo"
      columns={["full_name", "role_title", "is_published"]}
      defaultValues={{ display_order: 0, is_published: true }}
      fields={[
        { name: "full_name", label: "Nombre completo", type: "text", required: true },
        { name: "role_title", label: "Cargo", type: "text", required: true },
        { name: "bio", label: "Biografía", type: "textarea" },
        { name: "photo_url", label: "URL de la foto", type: "url" },
        { name: "linkedin_url", label: "URL de LinkedIn", type: "url" },
        { name: "display_order", label: "Orden", type: "number" },
        { name: "is_published", label: "Publicado", type: "checkbox" },
      ]}
    />
  );
}
