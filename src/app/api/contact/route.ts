import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "node:crypto";

async function verifyTurnstile(token: string, ip: string) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
      remoteip: ip,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

function hashIp(ip: string) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 1. Rate limiting por IP — mitiga fuerza bruta / envío masivo de spam
  const { success: withinLimit } = await checkRateLimit(`contact:${ip}`);
  if (!withinLimit) {
    return NextResponse.json({ message: "Demasiadas solicitudes. Inténtalo más tarde." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  // 2. Honeypot — si el campo oculto llega relleno, es casi seguro un bot: se responde 200 sin procesar nada
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  // 3. Validación estricta de entrada con Zod
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Datos inválidos.", errors: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // 4. Verificación anti-bot con Turnstile
  const humanVerified = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ message: "Verificación anti-spam fallida." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 5. Guardar el lead en Supabase (nunca se guarda la IP en claro, solo su hash)
  const { error: dbError } = await supabase.from("contact_submissions").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    company: parsed.data.company || null,
    message: parsed.data.message,
    source_page: parsed.data.sourcePage ?? null,
    utm_source: parsed.data.utmSource ?? null,
    utm_medium: parsed.data.utmMedium ?? null,
    utm_campaign: parsed.data.utmCampaign ?? null,
    ip_hash: hashIp(ip),
  });

  if (dbError) {
    return NextResponse.json({ message: "No se pudo guardar tu mensaje." }, { status: 500 });
  }

  // 6. Notificación por correo vía Resend (no bloquea la respuesta si falla)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM!,
      to: process.env.CONTACT_EMAIL_TO!,
      subject: `Nuevo contacto de ${parsed.data.fullName} — SofDev`,
      reply_to: parsed.data.email,
      text: [
        `Nombre: ${parsed.data.fullName}`,
        `Email: ${parsed.data.email}`,
        `Teléfono: ${parsed.data.phone || "—"}`,
        `Empresa: ${parsed.data.company || "—"}`,
        `Mensaje:\n${parsed.data.message}`,
      ].join("\n"),
    });
  } catch {
    // El lead ya quedó guardado en la base de datos; el fallo de email no debe romper la respuesta al usuario.
  }

  return NextResponse.json({ ok: true });
}
