"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminPartnersPage() {
  return (
    <AdminCrudTable
      table="partner_companies"
      title="Empresas con las que hemos trabajado"
      columns={["name", "is_published"]}
      defaultValues={{ display_order: 0, is_published: true }}
      fields={[
        { name: "name", label: "Nombre de la empresa", type: "text", required: true },
        { name: "logo_url", label: "URL del logo", type: "url", required: true },
        { name: "website_url", label: "Sitio web", type: "url" },
        { name: "display_order", label: "Orden", type: "number" },
        { name: "is_published", label: "Publicado", type: "checkbox" },
      ]}
    />
  );
}
