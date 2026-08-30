import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "El nombre es demasiado corto").max(120),
  email: z.string().trim().email("Correo no válido").max(180),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(140).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Cuéntanos un poco más").max(4000),
  turnstileToken: z.string().min(1, "Verificación anti-spam requerida"),
  sourcePage: z.string().max(300).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  // Honeypot: debe llegar vacío. Si un bot lo rellena, se rechaza silenciosamente.
  website: z.string().max(0).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const teamMemberSchema = z.object({
  full_name: z.string().trim().min(2).max(140),
  role_title: z.string().trim().min(2).max(140),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  photo_url: z.string().trim().url().optional().or(z.literal("")),
  linkedin_url: z.string().trim().url().optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});
