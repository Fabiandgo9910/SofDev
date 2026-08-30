import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con SERVICE ROLE KEY. Uso EXCLUSIVO en el servidor (route handlers / server actions
// que ya validaron el rol del usuario). Nunca importar este archivo desde un componente cliente.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
