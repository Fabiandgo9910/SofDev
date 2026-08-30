"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminFaqPage() {
  return (
    <AdminCrudTable
      table="faq_items"
      title="Preguntas frecuentes"
      columns={["question", "locale", "is_published"]}
      defaultValues={{ locale: "es", display_order: 0, is_published: true }}
      fields={[
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
        { name: "question", label: "Pregunta", type: "text", required: true },
        { name: "answer", label: "Respuesta", type: "textarea", required: true },
        { name: "display_order", label: "Orden", type: "number" },
        { name: "is_published", label: "Publicada", type: "checkbox" },
      ]}
    />
  );
}
