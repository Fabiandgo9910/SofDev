-- ============================================================================
-- SOFDEV — MIGRACIÓN v1.3
-- Crea el bucket de Storage "media" para subir imágenes directamente desde
-- el panel de administración (equipo, proyectos, blog, partners, reseñas)
-- en lugar de tener que pegar una URL a mano.
--
-- Es SEGURA de ejecutar aunque ya la hayas corrido antes (idempotente).
-- Cómo usarla: Supabase → SQL Editor → pega todo → Run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. BUCKET "media": público en lectura (para que las imágenes se vean en el
--    sitio sin autenticación), máx. 5 MB por archivo, solo formatos de imagen.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 2. POLÍTICAS: lectura pública; escritura solo para staff activo
--    (editor/admin/super_admin), reutilizando la misma función
--    public.is_admin_or_super() que ya protege el resto del contenido.
-- ---------------------------------------------------------------------------
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_staff_insert" on storage.objects;
create policy "media_staff_insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin_or_super());

drop policy if exists "media_staff_update" on storage.objects;
create policy "media_staff_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin_or_super())
  with check (bucket_id = 'media' and public.is_admin_or_super());

drop policy if exists "media_staff_delete" on storage.objects;
create policy "media_staff_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin_or_super());

-- ============================================================================
-- FIN DE LA MIGRACIÓN v1.3
-- ============================================================================
