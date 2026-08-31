# CHANGELOG — SofDev

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [1.3.0] - Pulido visual, navbar fija, WhatsApp flotante, eventos y SEO

### Cambiado
- Hero: la transición hacia el fondo de la página ya no se corta en seco — la rejilla decorativa y los blobs ahora se difuminan de forma gradual más allá del límite de la sección.
- Barra de navegación ahora es `fixed` real (antes `sticky`), con un espaciador que compensa su altura para que no tape el contenido.

### Añadido
- Botón flotante fijo de WhatsApp (visible en todas las páginas, con animación de pulso), leyendo el número desde `/admin/settings`. El botón de "subir arriba" se reubicó para no solaparse con él.
- Recopilación de eventos: nueva utilidad `trackEvent()` que registra en `marketing_events` (respetando el consentimiento de cookies — no se envía nada si el usuario no aceptó analítica/marketing). Instrumentado en: CTAs del Hero, botones de llamada/WhatsApp/email, envío del formulario de contacto y vistas de página.
- Nueva política RLS para permitir la inserción pública en `marketing_events` (antes bloqueada por defecto — ver `migration_v1.2.sql`).
- Mejoras de SEO: se corrigió un bug donde el `canonical` de **todas** las páginas apuntaba por error a la home (estaba definido a nivel de layout); ahora cada página define el suyo propio, con hreflang para los 4 idiomas. JSON-LD `FAQPage` en `/faq` y en la sección FAQ de la landing. JSON-LD de la organización enriquecido con teléfono, email y `aggregateRating` calculado a partir de las reseñas. Panel `/admin` marcado como `noindex`.

## [1.2.0] - Rediseño creativo y responsividad completa

### Añadido / cambiado
- Hero rediseñado: badge animado, tipografía fluida con `clamp()`, patrón de rejilla decorativo, indicador de scroll y protección de texto largo (`line-clamp`, `break-words`).
- Protección de layout contra textos largos introducidos desde el admin en todas las tarjetas (servicios, proyectos, equipo, blog, reseñas, empresas, FAQ, quiénes somos): título/descripción con `line-clamp`, tarjetas de igual altura (`flex h-full flex-col` + `mt-auto` en los enlaces), nombres/roles truncados.
- Header totalmente responsive: selector de idioma compacto (códigos ES/EN/PT/IT), navegación de escritorio a partir de `xl`, menú móvil mejorado.
- Panel de administración totalmente responsive: sidebar deslizante (off-canvas) en móvil/tablet con barra superior propia, fijo en escritorio (`lg+`); la tabla CRUD se muestra como tarjetas apiladas en móvil y como tabla en pantallas medianas o superiores.
- Espaciados de sección ajustados por breakpoint para una sensación más cuidada en móvil.

### Corregido
- Se repuso la clave `footer` que faltaba en los 4 diccionarios de idioma tras el rediseño anterior (causaba error de tipos en las páginas legales).

## [1.1.0] - Rediseño a landing de una sola página

### Añadido
- Home rediseñado como landing de una sola página (one-page): Hero, Quiénes somos, Servicios, Proyectos, Empresas, Equipo, Reseñas, Blog, FAQ y Contacto, todo en la misma página con anclas (`#nosotros`, `#servicios`, etc.) y scroll suave.
- Navegación del header actualizada para desplazarse a las secciones del Home en vez de páginas separadas (las páginas individuales siguen existiendo para SEO y enlaces directos).
- Gestión desde el admin de: teléfono de llamada, número de WhatsApp (con mensaje predefinido) y correo de contacto (`/admin/settings`), mostrados como botones rápidos en el footer y en la sección de contacto.
- Preguntas frecuentes ahora gestionables desde el admin (`/admin/faq`) y leídas desde base de datos tanto en `/faq` como en la sección de la landing.
- Tablas nuevas en Supabase: `contact_info` (fila única) y `faq_items`, con sus políticas RLS.

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
