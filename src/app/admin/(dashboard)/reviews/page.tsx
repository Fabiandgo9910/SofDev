"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminReviewsPage() {
  return (
    <AdminCrudTable
      table="google_reviews"
      title="Reseñas de Google"
      columns={["author_name", "rating", "is_featured"]}
      defaultValues={{ rating: 5, display_order: 0, is_featured: true }}
      fields={[
        { name: "author_name", label: "Nombre del autor", type: "text", required: true },
        { name: "author_photo_url", label: "Foto del autor (URL)", type: "url" },
        { name: "rating", label: "Puntuación (1-5)", type: "number", required: true },
        { name: "review_text", label: "Texto de la reseña", type: "textarea" },
        { name: "review_date", label: "Fecha (AAAA-MM-DD)", type: "text" },
        { name: "display_order", label: "Orden", type: "number" },
        { name: "is_featured", label: "Destacada", type: "checkbox" },
      ]}
    />
  );
}
