-- ============================================================================
-- SOFDEV - ESQUEMA COMPLETO DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- Fase 1 de 5. Ejecutar completo en el SQL Editor de Supabase, en orden.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONES
-- ---------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. ROLES Y PERFILES DE USUARIO (extiende auth.users)
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('super_admin', 'admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role public.app_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: crea automáticamente un perfil al registrarse un usuario en auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'editor');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Función helper para políticas RLS: obtiene el rol del usuario autenticado
create or replace function public.current_user_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Cualquier miembro del staff activo (editor, admin o super_admin) puede gestionar el contenido.
-- Solo super_admin gestiona usuarios y roles (ver is_super_admin más abajo).
create or replace function public.is_admin_or_super()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid() and is_active = true) in ('editor','admin','super_admin'),
    false
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()) = 'super_admin', false);
$$;

-- ---------------------------------------------------------------------------
-- 2. CONTENIDO EDITABLE POR CLAVE (Hero, Quiénes somos, textos sueltos)
-- ---------------------------------------------------------------------------
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique, -- ej: 'hero', 'quienes_somos', 'footer_cta'
  locale text not null default 'es' check (locale in ('es','en','pt','it')),
  title text,
  subtitle text,
  body text,
  image_url text,
  extra jsonb default '{}'::jsonb, -- campos libres extra por sección
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);
create unique index site_content_key_locale_idx on public.site_content (section_key, locale);

-- ---------------------------------------------------------------------------
-- 3. EQUIPO
-- ---------------------------------------------------------------------------
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  bio text,
  photo_url text,
  linkedin_url text,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. SERVICIOS
-- ---------------------------------------------------------------------------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'es' check (locale in ('es','en','pt','it')),
  slug text not null,
  title text not null,
  short_description text,
  full_description text,
  icon text, -- nombre de icono (ej. lucide-react)
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index services_slug_locale_idx on public.services (slug, locale);

-- ---------------------------------------------------------------------------
-- 5. PROYECTOS REALIZADOS
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'es' check (locale in ('es','en','pt','it')),
  slug text not null,
  title text not null,
  client_name text,
  summary text,
  content text,
  cover_image_url text,
  gallery jsonb default '[]'::jsonb,
  tags text[] default '{}',
  project_url text,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index projects_slug_locale_idx on public.projects (slug, locale);

-- ---------------------------------------------------------------------------
-- 6. EMPRESAS CON LAS QUE HAN TRABAJADO (logos)
-- ---------------------------------------------------------------------------
create table public.partner_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 7. BLOG
-- ---------------------------------------------------------------------------
create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'es' check (locale in ('es','en','pt','it')),
  slug text not null,
  name text not null
);
create unique index blog_categories_slug_locale_idx on public.blog_categories (slug, locale);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'es' check (locale in ('es','en','pt','it')),
  slug text not null,
  category_id uuid references public.blog_categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index blog_posts_slug_locale_idx on public.blog_posts (slug, locale);

-- ---------------------------------------------------------------------------
-- 8. RESEÑAS DE GOOGLE (cacheadas/gestionadas manualmente)
-- ---------------------------------------------------------------------------
create table public.google_reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_photo_url text,
  rating smallint not null check (rating between 1 and 5),
  review_text text,
  review_date date,
  is_featured boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. LEADS / FORMULARIO DE CONTACTO / MARKETING
-- ---------------------------------------------------------------------------
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text, -- hash del IP, nunca el IP en claro (privacidad)
  status text not null default 'new' check (status in ('new','contacted','archived')),
  created_at timestamptz not null default now()
);

create table public.marketing_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null, -- ej: 'cta_click', 'page_view', 'newsletter_signup'
  page_path text,
  locale text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 10. CONSENTIMIENTO DE COOKIES (RGPD/CCPA)
-- ---------------------------------------------------------------------------
create table public.cookie_consents (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null, -- id anónimo generado en el cliente (no PII)
  necessary boolean not null default true,
  analytics boolean not null default false,
  marketing boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.team_members enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.partner_companies enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.google_reviews enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.marketing_events enable row level security;
alter table public.cookie_consents enable row level security;

-- PROFILES: cada usuario ve/edita el suyo; super_admin ve y gestiona todos
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin_or_super());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));
create policy "profiles_super_admin_manage" on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- CONTENIDO PÚBLICO: lectura pública si está publicado; escritura solo admin/editor
create policy "site_content_public_read" on public.site_content for select using (true);
create policy "site_content_admin_write" on public.site_content for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "team_public_read" on public.team_members for select using (is_published = true or public.is_admin_or_super());
create policy "team_admin_write" on public.team_members for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "services_public_read" on public.services for select using (is_published = true or public.is_admin_or_super());
create policy "services_admin_write" on public.services for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "projects_public_read" on public.projects for select using (is_published = true or public.is_admin_or_super());
create policy "projects_admin_write" on public.projects for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "partners_public_read" on public.partner_companies for select using (is_published = true or public.is_admin_or_super());
create policy "partners_admin_write" on public.partner_companies for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "blog_categories_public_read" on public.blog_categories for select using (true);
create policy "blog_categories_admin_write" on public.blog_categories for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "blog_posts_public_read" on public.blog_posts for select using (is_published = true or public.is_admin_or_super());
create policy "blog_posts_admin_write" on public.blog_posts for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

create policy "reviews_public_read" on public.google_reviews for select using (true);
create policy "reviews_admin_write" on public.google_reviews for all
  using (public.is_admin_or_super()) with check (public.is_admin_or_super());

-- LEADS: nadie puede leer desde el cliente salvo admin; inserción pública controlada vía Edge Function (service role)
create policy "contact_admin_read" on public.contact_submissions for select using (public.is_admin_or_super());
create policy "contact_admin_manage" on public.contact_submissions for update using (public.is_admin_or_super());
-- La inserción NO se permite directamente por RLS anónima: se hace desde una Edge Function
-- con la service_role key, tras pasar Turnstile/reCAPTCHA y rate limiting.

create policy "marketing_admin_read" on public.marketing_events for select using (public.is_admin_or_super());

create policy "cookie_consents_insert_public" on public.cookie_consents for insert with check (true);
create policy "cookie_consents_admin_read" on public.cookie_consents for select using (public.is_admin_or_super());

-- ============================================================================
-- 12. DATOS INICIALES (seed mínimo para no arrancar en blanco)
-- ============================================================================
insert into public.site_content (section_key, locale, title, subtitle, body) values
  ('hero', 'es', 'SofDev', 'Consultoría tecnológica que impulsa tu negocio', 'Diseñamos y desarrollamos soluciones digitales a medida.'),
  ('quienes_somos', 'es', 'Quiénes somos', null, 'Contenido editable desde el panel de administración.')
on conflict (section_key, locale) do nothing;

-- ============================================================================
-- FIN FASE 1 — Esquema de base de datos completo.
-- Siguiente: crear el primer super_admin manualmente tras registrarte, con:
--   update public.profiles set role = 'super_admin' where id = '<tu-uuid-de-auth>';
-- ============================================================================
