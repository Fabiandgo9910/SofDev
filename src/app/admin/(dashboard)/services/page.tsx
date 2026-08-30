"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminServicesPage() {
  return (
    <AdminCrudTable
      table="services"
      title="Servicios"
      columns={["title", "locale", "is_published"]}
      defaultValues={{ locale: "es", display_order: 0, is_published: true }}
      fields={[
        { name: "title", label: "Título", type: "text", required: true },
        { name: "slug", label: "Slug (URL)", type: "text", required: true },
        {
          name: "locale",
          label: "Idioma",
          type: "select",
          required: true,
          options: [
            { value: "es", label: "Español" },
            { value: "en", label: "English" },
            { value: "pt", label: "Português" },
            { value: "it", label: "Italiano" },
          ],
        },
        { name: "short_description", label: "Descripción corta", type: "textarea" },
        { name: "full_description", label: "Descripción completa", type: "textarea" },
        { name: "icon", label: "Icono (lucide-react)", type: "text" },
        { name: "display_order", label: "Orden", type: "number" },
        { name: "is_published", label: "Publicado", type: "checkbox" },
      ]}
    />
  );
}
