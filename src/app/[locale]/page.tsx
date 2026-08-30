import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { GlassCard } from "@/components/glass/glass-card";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("title, subtitle")
    .eq("section_key", "hero")
    .eq("locale", params.locale)
    .maybeSingle();

  return {
    title: data?.title ?? "SofDev",
    description: data?.subtitle ?? "Consultoría tecnológica que impulsa tu negocio.",
  };
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();

  const [{ data: heroContent }, { data: services }, { data: projects }, { data: partners }, { data: reviews }, { data: posts }] =
    await Promise.all([
      supabase
        .from("site_content")
        .select("title, subtitle")
        .eq("section_key", "hero")
        .eq("locale", params.locale)
        .maybeSingle(),
      supabase
        .from("services")
        .select("id, title, short_description, slug")
        .eq("locale", params.locale)
        .eq("is_published", true)
        .order("display_order")
        .limit(6),
      supabase
        .from("projects")
        .select("id, title, summary, slug, cover_image_url")
        .eq("locale", params.locale)
        .eq("is_published", true)
        .order("display_order")
        .limit(3),
      supabase
        .from("partner_companies")
        .select("id, name, logo_url, website_url")
        .eq("is_published", true)
        .order("display_order"),
      supabase
        .from("google_reviews")
        .select("id, author_name, rating, review_text")
        .eq("is_featured", true)
        .order("display_order")
        .limit(3),
      supabase
        .from("blog_posts")
        .select("id, title, excerpt, slug, cover_image_url")
        .eq("locale", params.locale)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3),
    ]);

  return (
    <>
      <Hero
        locale={params.locale}
        title={heroContent?.title ?? "SofDev"}
        subtitle={heroContent?.subtitle ?? "Consultoría tecnológica que impulsa tu negocio."}
        ctaPrimary={dict.hero.cta_primary}
        ctaSecondary={dict.hero.cta_secondary}
      />

      {!!services?.length && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <GlassCard key={service.id}>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm opacity-80">{service.short_description}</p>
                <Link
                  href={`/${params.locale}/servicios#${service.slug}`}
                  className="focus-ring mt-4 inline-block text-sm font-medium text-brand-500 hover:underline"
                >
                  {dict.nav.services} →
                </Link>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {!!partners?.length && (
        <section className="mx-auto max-w-6xl px-6 py-12 text-center">
          <h2 className="mb-8 text-2xl font-semibold">{dict.sections.partners}</h2>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-80">
            {partners.map((partner) =>
              partner.website_url ? (
                <a key={partner.id} href={partner.website_url} target="_blank" rel="noopener noreferrer">
                  <Image src={partner.logo_url} alt={partner.name} width={120} height={48} className="grayscale transition hover:grayscale-0" />
                </a>
              ) : (
                <Image key={partner.id} src={partner.logo_url} alt={partner.name} width={120} height={48} className="grayscale transition hover:grayscale-0" />
              )
            )}
          </div>
        </section>
      )}

      {!!projects?.length && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="mb-8 text-2xl font-semibold">{dict.sections.featured_projects}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/${params.locale}/proyectos/${project.slug}`}>
                <GlassCard className="h-full">
                  {project.cover_image_url && (
                    <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl">
                      <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm opacity-80">{project.summary}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!!reviews?.length && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="mb-8 text-2xl font-semibold">{dict.sections.featured_reviews}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <GlassCard key={review.id}>
                <div className="flex gap-1 text-yellow-400" aria-label={`${review.rating} de 5 estrellas`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 text-sm opacity-80">&ldquo;{review.review_text}&rdquo;</p>
                <p className="mt-4 text-sm font-medium">{review.author_name}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {!!posts?.length && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="mb-8 text-2xl font-semibold">{dict.sections.latest_posts}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/${params.locale}/blog/${post.slug}`}>
                <GlassCard className="h-full">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="mt-2 text-sm opacity-80">{post.excerpt}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
