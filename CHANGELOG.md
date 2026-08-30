# CHANGELOG — SofDev

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [1.0.0] - Fase 1-5 completas

### Añadido
- Fase 1: esquema de Supabase (tablas, roles, RLS), `next.config.js` con cabeceras de seguridad, middleware de i18n + protección de `/admin`.
- Fase 2: layout raíz, tema claro/oscuro persistente, componentes Glassmorphism, Hero animado, header/footer, botones flotantes (volver / subir), barra de progreso de carga.
- Fase 3: páginas públicas conectadas a Supabase — Quiénes somos, Equipo, Servicios, Proyectos (lista + detalle), Empresas (sección en home), Blog (lista + detalle), Reseñas, FAQ con buscador, Contacto con Turnstile + Resend + rate limiting + honeypot.
- Fase 4: panel de administración con login, roles (editor/admin/super_admin), CRUD genérico reutilizable para Equipo/Servicios/Proyectos/Empresas/Blog/Reseñas, editor de contenido (Hero/Quiénes somos/legales), gestión de leads, gestión de usuarios (solo super_admin).
- Fase 5: `sitemap.xml` y `robots.txt` dinámicos, JSON-LD (Organization + BlogPosting), páginas legales dinámicas, banner de cookies RGPD/CCPA, página 404 personalizada, favicon SVG, este CHANGELOG.

### Pendiente / recomendado antes de producción
- Sustituir el favicon SVG por un set multi-resolución (PNG/ICO) con tu branding definitivo.
- Definir logo y paleta de colores reales (actualmente usa una paleta azul de marcador de posición en `tailwind.config.ts`).
- Configurar dominio, Turnstile, Resend y Upstash con credenciales reales de producción.
- Revisar textos legales (privacidad/términos) con asesoría legal antes de publicar.
