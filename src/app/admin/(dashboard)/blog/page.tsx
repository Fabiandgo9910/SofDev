"use client";

import { AdminCrudTable } from "@/components/admin/crud-table";

export default function AdminBlogPage() {
  return (
    <AdminCrudTable
      table="blog_posts"
      title="Blog"
      orderBy="created_at"
      columns={["title", "locale", "is_published"]}
      defaultValues={{ locale: "es", is_published: false }}
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
        { name: "excerpt", label: "Extracto", type: "textarea" },
        { name: "content", label: "Contenido", type: "textarea", required: true },
        { name: "cover_image_url", label: "Imagen de portada (URL)", type: "url" },
        { name: "meta_title", label: "Meta título (SEO)", type: "text" },
        { name: "meta_description", label: "Meta descripción (SEO)", type: "textarea" },
        { name: "published_at", label: "Fecha de publicación (AAAA-MM-DD)", type: "text" },
        { name: "is_published", label: "Publicado", type: "checkbox" },
      ]}
    />
  );
}
