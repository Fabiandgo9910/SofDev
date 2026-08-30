import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

async function requireSuperAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") return { ok: false as const, status: 403 };

  return { ok: true as const, user };
}

export async function GET() {
  const check = await requireSuperAdmin();
  if (!check.ok) return NextResponse.json({ message: "No autorizado." }, { status: check.status });

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

const inviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(140),
  role: z.enum(["editor", "admin", "super_admin"]),
});

export async function POST(request: NextRequest) {
  const check = await requireSuperAdmin();
  if (!check.ok) return NextResponse.json({ message: "No autorizado." }, { status: check.status });

  const body = await request.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos.", errors: parsed.error.flatten() }, { status: 422 });
  }

  const admin = createAdminClient();

  // Crea el usuario y le envía un correo de invitación para establecer su propia contraseña.
  const { data: created, error: createError } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    data: { full_name: parsed.data.fullName },
  });

  if (createError || !created.user) {
    return NextResponse.json({ message: createError?.message ?? "No se pudo invitar al usuario." }, { status: 500 });
  }

  // El trigger on_auth_user_created ya creó el perfil con rol 'editor'; ajustamos el rol solicitado.
  const { error: updateError } = await admin
    .from("profiles")
    .update({ role: parsed.data.role, full_name: parsed.data.fullName })
    .eq("id", created.user.id);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

const updateSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["editor", "admin", "super_admin"]).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  const check = await requireSuperAdmin();
  if (!check.ok) return NextResponse.json({ message: "No autorizado." }, { status: check.status });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Datos inválidos." }, { status: 422 });
  }

  const admin = createAdminClient();
  const payload: Record<string, unknown> = {};
  if (parsed.data.role) payload.role = parsed.data.role;
  if (typeof parsed.data.isActive === "boolean") payload.is_active = parsed.data.isActive;

  const { error } = await admin.from("profiles").update(payload).eq("id", parsed.data.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
