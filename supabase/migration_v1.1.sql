-- ============================================================================
-- SOFDEV — MIGRACIÓN v1.1
-- Actualiza una base de datos que ya tiene el schema.sql original (Fase 1)
-- para soportar: FAQ gestionable, contacto rápido (llamada/WhatsApp/email)
-- y el permiso corregido de 'editor' para gestionar contenido.
--
-- Es SEGURO ejecutar este script aunque ya lo hayas corrido antes:
-- todas las operaciones son idempotentes (no falla si algo ya existe).
--
-- Cómo usarlo: Supabase → SQL Editor → pega todo → Run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CORREGIR PERMISOS: el rol 'editor' también debe poder gestionar contenido
--    (antes solo 'admin' y 'super_admin' podían escribir, por RLS).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin_or_super()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid() and is_active = true) in ('editor','admin','super_admin'),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. PREGUNTAS FRECUENTES (FAQ)
-- ---------------------------------------------------------------------------
create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'es' check (locale in ('es','en','pt','it')),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.faq_items enable row level security;

drop policy if exists "faq_public_read" on public.faq_items;
create policy "faq_public_read" on public.faq_items
  for select using (is_published = true or public.is_admin_or_super());

drop policy if exists "faq_admin_write" on public.faq_items;
create policy "faq_admin_write" on public.faq_items
  for all using (public.is_admin_or_super()) with check (public.is_admin_or_super());

insert into public.faq_items (locale, question, answer, display_order)
select * from (values
  ('es', '¿Qué servicios ofrece SofDev?', 'Consultoría, diseño y desarrollo de soluciones digitales a medida: webs, aplicaciones, automatizaciones y más.', 1),
  ('es', '¿Cuánto tarda un proyecto típico?', 'Depende del alcance; tras la primera reunión te damos un cronograma estimado y claro.', 2),
  ('es', '¿Trabajan con empresas de cualquier tamaño?', 'Sí, adaptamos el alcance y el presupuesto a startups, pymes y grandes empresas.', 3),
  ('es', '¿Ofrecen mantenimiento después del lanzamiento?', 'Sí, ofrecemos planes de soporte y mantenimiento continuo tras la entrega.', 4)
) as seed(locale, question, answer, display_order)
where not exists (select 1 from public.faq_items);

-- ---------------------------------------------------------------------------
-- 3. CONTACTO RÁPIDO (llamada / WhatsApp / email) — fila única
-- ---------------------------------------------------------------------------
create table if not exists public.contact_info (
  id boolean primary key default true,
  phone_number text,
  whatsapp_number text,
  whatsapp_default_message text,
  contact_email text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  constraint contact_info_singleton check (id = true)
);

alter table public.contact_info enable row level security;

drop policy if exists "contact_info_public_read" on public.contact_info;
create policy "contact_info_public_read" on public.contact_info
  for select using (true);

drop policy if exists "contact_info_admin_write" on public.contact_info;
create policy "contact_info_admin_write" on public.contact_info
  for all using (public.is_admin_or_super()) with check (public.is_admin_or_super());

insert into public.contact_info (id, phone_number, whatsapp_number, whatsapp_default_message, contact_email)
values (true, '+34 900 000 000', '34900000000', 'Hola, me gustaría más información sobre SofDev', 'contacto@sofdev.com')
on conflict (id) do nothing;

-- ============================================================================
-- FIN DE LA MIGRACIÓN v1.1
-- Verifica en Table Editor que aparezcan 'faq_items' y 'contact_info',
-- y edita sus datos reales desde /admin/faq y /admin/settings.
-- ============================================================================
