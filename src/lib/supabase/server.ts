import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Cliente para Server Components / Route Handlers, respeta RLS (usa la clave anon + cookies de sesión).
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Llamado desde un Server Component sin permiso de escritura de cookies; se ignora,
            // el middleware ya refresca la sesión en ese caso.
          }
        },
      },
    }
  );
}
