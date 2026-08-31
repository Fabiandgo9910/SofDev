-- ============================================================================
-- SOFDEV — MIGRACIÓN v1.2
-- Añade la política que faltaba para poder registrar eventos (marketing_events)
-- desde el sitio público. Sin esto, cualquier intento de insertar un evento
-- fallaba silenciosamente por RLS (la tabla ya existía pero solo tenía
-- política de lectura para admins).
--
-- Segura de ejecutar aunque ya la hayas corrido antes.
-- Supabase → SQL Editor → pega todo → Run.
-- ============================================================================

drop policy if exists "marketing_events_insert_public" on public.marketing_events;
create policy "marketing_events_insert_public" on public.marketing_events
  for insert with check (true);

-- ============================================================================
-- FIN DE LA MIGRACIÓN v1.2
-- ============================================================================
