import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return buildMetadata({
    locale: params.locale,
    path: "/equipo",
    title: "Equipo",
    description: "Conoce al equipo de SofDev, el talento detrás de cada proyecto.",
  });
}

export default async function TeamPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("id, full_name, role_title, bio, photo_url, linkedin_url")
    .eq("is_published", true)
    .order("display_order");

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold">{dict.nav.team}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => (
          <GlassCard key={member.id} className="text-center">
            {member.photo_url && (
              <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full">
                <Image src={member.photo_url} alt={member.full_name} fill className="object-cover" />
              </div>
            )}
            <h3 className="truncate font-semibold">{member.full_name}</h3>
            <p className="truncate text-sm text-brand-500">{member.role_title}</p>
            {member.bio && <p className="mt-2 line-clamp-4 break-words text-sm opacity-80">{member.bio}</p>}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-3 inline-block text-sm text-brand-500 hover:underline"
              >
                LinkedIn
              </a>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
