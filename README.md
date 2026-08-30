# SofDev — Web de consultoría (Next.js + Supabase + Vercel)

Aplicación completa: sitio público multiidioma (ES/EN/PT/IT) con Glassmorphism, tema claro/oscuro,
SEO avanzado, formulario de contacto anti-spam, y panel de administración con roles para gestionar
absolutamente todo el contenido desde base de datos.

## 1. Requisitos previos

- Node.js 20+
- Cuenta de [Supabase](https://supabase.com) (proyecto nuevo, plan gratuito sirve para empezar)
- Cuenta de [Vercel](https://vercel.com)
- Cuenta de [Resend](https://resend.com) (envío de emails del formulario de contacto)
- Cuenta de [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) (anti-spam del formulario)
- Cuenta de [Upstash](https://upstash.com) (Redis serverless, usado para rate limiting)

## 2. Instalación local

```bash
# Si partes de este entregable, ya tienes package.json, next.config.js, etc.
npm install
cp .env.local.example .env.local
```

Rellena `.env.local` con tus claves reales (ver sección 4).

## 3. Base de datos (Supabase)

1. Crea un proyecto en Supabase.
2. Ve a **SQL Editor** → pega el contenido completo de `supabase/schema.sql` → ejecútalo.
   Esto crea todas las tablas, los roles (`editor`, `admin`, `super_admin`), las políticas RLS
   y algunos datos semilla.
3. Ve a **Authentication → Providers** y confirma que "Email" esté habilitado.
4. Ve a **Authentication → URL Configuration** y añade tu dominio de producción y
   `http://localhost:3000` a las Redirect URLs.
5. Registra tu primer usuario (desde `/admin/login` no funcionará hasta tener un usuario —
   créalo manualmente en **Authentication → Users → Add user**, o usa el flujo de invitación
   una vez tengas ya un super_admin).
6. Convierte ese primer usuario en super_admin ejecutando en el SQL Editor:

```sql
update public.profiles set role = 'super_admin' where id = '<uuid-del-usuario>';
```

A partir de aquí, ese super_admin puede invitar a más usuarios desde `/admin/users`.

## 4. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa:

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (clave secreta, **solo servidor**) |
| `RESEND_API_KEY` | Resend → API Keys |
| `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM` | Tus direcciones de correo (el FROM debe ser de un dominio verificado en Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile → tu widget |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Upstash → tu base Redis → REST API |
| `NEXT_PUBLIC_SITE_URL` | Tu dominio final, ej. `https://www.sofdev.com` |

## 5. Ejecutar en local

```bash
npm run dev
```

Abre `http://localhost:3000` — el middleware redirige automáticamente a `/es`, `/en`, `/pt` o `/it`.
El panel de administración está en `http://localhost:3000/admin/login`.

## 6. Desplegar en Vercel

1. Sube el proyecto a GitHub/GitLab (verifica que `.env.local` no esté incluido — ya está en `.gitignore`).
2. En Vercel: **New Project** → importa el repositorio.
3. En **Environment Variables**, añade exactamente las mismas claves que en tu `.env.local`.
4. Despliega. Vercel gestiona el SSL/HTTPS automáticamente; `next.config.js` fuerza además
   cabeceras HSTS, CSP, X-Frame-Options, etc. en producción.
5. En **Settings → Domains**, añade tu dominio propio y configura los registros DNS indicados.
6. En Supabase, actualiza **Authentication → URL Configuration** con tu dominio final de producción.

## 7. Estructura del proyecto

```
src/
  app/
    [locale]/           páginas públicas (home, quiénes somos, equipo, servicios, proyectos,
                         blog, reseñas, faq, contacto, privacidad, términos)
    admin/
      login/             login del panel
      (dashboard)/        panel protegido: contenido, equipo, servicios, proyectos, empresas,
                           blog, reseñas, leads, usuarios (super_admin)
    api/
      contact/            envío del formulario (Zod + Turnstile + rate limit + Resend)
      admin/users/         invitación y gestión de roles (solo super_admin)
    sitemap.ts / robots.ts  SEO dinámico
    not-found.tsx           404 personalizada
  components/            Header, Footer, Hero, Glassmorphism UI, banner de cookies, admin CRUD
  lib/
    supabase/             clientes browser / server / admin (service role)
    i18n/                  diccionarios ES/EN/PT/IT
    validations.ts         esquemas Zod
    rate-limit.ts           Upstash rate limiting
supabase/
  schema.sql              esquema completo de base de datos + RLS + seed
```

## 8. Cómo se gestiona el contenido

Todo el contenido (textos de Hero y "Quiénes somos", equipo, servicios, proyectos, empresas,
blog y reseñas) vive en Supabase y se edita desde `/admin`. No hace falta tocar código para
actualizar el sitio.

Roles:
- **editor**: puede editar todo el contenido.
- **admin**: igual que editor (reservado para diferenciar permisos futuros si se necesitan).
- **super_admin**: además de editar contenido, puede invitar usuarios y cambiar roles desde `/admin/users`.

## 9. Pendiente antes de producción

Ver `CHANGELOG.md` — principalmente: definir branding real (logo, paleta de colores, favicon
multi-resolución) y revisar los textos legales con asesoría profesional.
