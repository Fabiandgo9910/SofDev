"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminProjectsPage() {
  return (
    <AdminCrudTable
      table="projects"
      title="Proyectos realizados"
      columns={["title", "locale", "client_name", "is_published"]}
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
        { name: "client_name", label: "Cliente", type: "text" },
        { name: "summary", label: "Resumen", type: "textarea" },
        { name: "content", label: "Contenido completo", type: "textarea" },
        { name: "cover_image_url", label: "Imagen de portada (URL)", type: "url" },
        { name: "project_url", label: "URL del proyecto", type: "url" },
        { name: "display_order", label: "Orden", type: "number" },
        { name: "is_published", label: "Publicado", type: "checkbox" },
      ]}
    />
  );
}
