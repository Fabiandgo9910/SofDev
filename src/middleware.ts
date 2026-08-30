import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOCALES = ["es", "en", "pt", "it"] as const;
const DEFAULT_LOCALE = "es";

function getLocaleFromRequest(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0];
  return LOCALES.includes(preferred as (typeof LOCALES)[number])
    ? (preferred as string)
    : DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Nunca aplicar i18n a rutas internas, admin, api o assets
  const isInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".");

  let response = NextResponse.next();

  if (!isInternal) {
    const hasLocale = LOCALES.some(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );
    if (!hasLocale) {
      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
      const locale =
        cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
          ? cookieLocale
          : getLocaleFromRequest(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // 2. Gestión de sesión de Supabase (necesario en App Router para refrescar cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Protección del panel de administración
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile?.is_active || !["admin", "super_admin", "editor"].includes(profile?.role ?? "")) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    // Zona exclusiva de super_admin (gestión de usuarios)
    if (pathname.startsWith("/admin/users") && profile.role !== "super_admin") {
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = "/admin";
      return NextResponse.redirect(deniedUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
