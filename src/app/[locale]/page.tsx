import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { ContactForm } from "@/components/contact-form";
import { ContactQuickActions } from "@/components/contact-quick-actions";

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

  const [
    { data: heroContent },
    { data: aboutContent },
    { data: services },
    { data: projects },
    { data: partners },
    { data: team },
    { data: reviews },
    { data: posts },
    { data: faqItems },
  ] = await Promise.all([
    supabase.from("site_content").select("title, subtitle").eq("section_key", "hero").eq("locale", params.locale).maybeSingle(),
    supabase.from("site_content").select("title, body").eq("section_key", "quienes_somos").eq("locale", params.locale).maybeSingle(),
    supabase.from("services").select("id, title, short_description, slug").eq("locale", params.locale).eq("is_published", true).order("display_order").limit(6),
    supabase.from("projects").select("id, title, summary, slug, cover_image_url").eq("locale", params.locale).eq("is_published", true).order("display_order").limit(3),
    supabase.from("partner_companies").select("id, name, logo_url, website_url").eq("is_published", true).order("display_order"),
    supabase.from("team_members").select("id, full_name, role_title, photo_url").eq("is_published", true).order("display_order").limit(4),
    supabase.from("google_reviews").select("id, author_name, rating, review_text").eq("is_featured", true).order("display_order").limit(3),
    supabase.from("blog_posts").select("id, title, excerpt, slug, cover_image_url").eq("locale", params.locale).eq("is_published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("faq_items").select("id, question, answer").eq("locale", params.locale).eq("is_published", true).order("display_order").limit(6),
  ]);

  return (
    <>
      <section id="inicio" className="section-anchor">
        <Hero
          locale={params.locale}
          title={heroContent?.title ?? "SofDev"}
          subtitle={heroContent?.subtitle ?? "Consultoría tecnológica que impulsa tu negocio."}
          ctaPrimary={dict.hero.cta_primary}
          ctaSecondary={dict.hero.cta_secondary}
        />
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="nosotros" className="section-anchor mx-auto max-w-5xl px-6 py-20">
        <GlassCard hover={false} className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="SofDev" title={aboutContent?.title ?? dict.sections.about} align="left" />
            <p className="whitespace-pre-line opacity-80">
              {aboutContent?.body ?? "Contenido editable desde el panel de administración."}
            </p>
            <Link href={`/${params.locale}/quienes-somos`} className="focus-ring mt-6 inline-block text-sm font-medium text-brand-500 hover:underline">
              {dict.cta.read_more} →
            </Link>
          </div>
          <div
            aria-hidden="true"
            className="relative hidden h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-300/30 to-brand-600/30 md:flex"
          >
            <span className="animate-floaty text-6xl font-bold text-brand-500/40">SD</span>
          </div>
        </GlassCard>
      </section>

      {/* SERVICIOS */}
      {!!services?.length && (
        <section id="servicios" className="section-anchor mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.services} title={dict.sections.services_title} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <GlassCard key={service.id}>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm opacity-80">{service.short_description}</p>
                <Link href={`/${params.locale}/servicios#${service.slug}`} className="focus-ring mt-4 inline-block text-sm font-medium text-brand-500 hover:underline">
                  {dict.cta.read_more} →
                </Link>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* PROYECTOS */}
      {!!projects?.length && (
        <section id="proyectos" className="section-anchor mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.projects} title={dict.sections.featured_projects} />
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
          <div className="mt-8 text-center">
            <Link href={`/${params.locale}/proyectos`}>
              <GlassButton variant="ghost">{dict.cta.view_all_projects}</GlassButton>
            </Link>
          </div>
        </section>
      )}

      {/* EMPRESAS */}
      {!!partners?.length && (
        <section id="empresas" className="section-anchor mx-auto max-w-6xl px-6 py-20 text-center">
          <SectionHeading title={dict.sections.partners} />
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

      {/* EQUIPO */}
      {!!team?.length && (
        <section id="equipo" className="section-anchor mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.team} title={dict.sections.team} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <GlassCard key={member.id} className="text-center">
                {member.photo_url && (
                  <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    <Image src={member.photo_url} alt={member.full_name} fill className="object-cover" />
                  </div>
                )}
                <h3 className="font-semibold">{member.full_name}</h3>
                <p className="text-sm text-brand-500">{member.role_title}</p>
              </GlassCard>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={`/${params.locale}/equipo`}>
              <GlassButton variant="ghost">{dict.cta.meet_team}</GlassButton>
            </Link>
          </div>
        </section>
      )}

      {/* RESEÑAS */}
      {!!reviews?.length && (
        <section id="resenas" className="section-anchor mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.reviews} title={dict.sections.featured_reviews} />
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

      {/* BLOG */}
      {!!posts?.length && (
        <section id="blog" className="section-anchor mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.blog} title={dict.sections.latest_posts} />
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

      {/* FAQ */}
      {!!faqItems?.length && (
        <section id="faq" className="section-anchor mx-auto max-w-3xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.faq} title={dict.sections.faq} />
          <FaqAccordion items={faqItems} searchPlaceholder={dict.faq_search} showSearch={false} />
          <div className="mt-8 text-center">
            <Link href={`/${params.locale}/faq`}>
              <GlassButton variant="ghost">{dict.cta.view_all_faq}</GlassButton>
            </Link>
          </div>
        </section>
      )}

      {/* CONTACTO */}
      <section id="contacto" className="section-anchor mx-auto max-w-2xl px-6 py-20">
        <SectionHeading eyebrow={dict.nav.contact} title={dict.sections.contact} subtitle={dict.contact_quick.intro} />
        <div className="mb-8">
          <ContactQuickActions
            labels={{ call: dict.contact_quick.call, whatsapp: dict.contact_quick.whatsapp, email: dict.contact_quick.email }}
          />
        </div>
        <ContactForm dict={dict.contact_form} locale={params.locale} />
      </section>
    </>
  );
}
