import Image from "next/image";
import Link from "next/link";
import { Building2, HandHeart, HelpCircle, MessageSquare, Newspaper, Rocket, Star, Users, Wrench } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata, buildFaqJsonLd } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/hero";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { ContactForm } from "@/components/contact-form";
import { ContactQuickActions } from "@/components/contact-quick-actions";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_content")
    .select("title, subtitle")
    .eq("section_key", "hero")
    .eq("locale", params.locale)
    .maybeSingle();

  return buildMetadata({
    locale: params.locale,
    path: "",
    title: data?.title ?? "SofDev",
    description: data?.subtitle ?? "Consultoría tecnológica que impulsa tu negocio.",
  });
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
          eyebrow={dict.hero.eyebrow}
          title={heroContent?.title ?? "SofDev"}
          subtitle={heroContent?.subtitle ?? "Consultoría tecnológica que impulsa tu negocio."}
          ctaPrimary={dict.hero.cta_primary}
          ctaSecondary={dict.hero.cta_secondary}
        />
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="nosotros" className="section-anchor mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <Reveal>
          <GlassCard hover={false} className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <SectionHeading eyebrow="SofDev" title={aboutContent?.title ?? dict.sections.about} icon={HandHeart} align="left" />
              <p className="line-clamp-6 whitespace-pre-line break-words opacity-80">
                {aboutContent?.body ?? "Contenido editable desde el panel de administración."}
              </p>
              <Link href={`/${params.locale}/quienes-somos`} className="focus-ring group mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:underline">
                {dict.cta.read_more}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div
              aria-hidden="true"
              className="relative hidden h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-300/30 to-brand-600/30 md:flex"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-40" />
              <span className="animate-floaty relative text-6xl font-bold text-brand-500/40">SD</span>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* SERVICIOS */}
      {!!services?.length && (
        <section id="servicios" className="section-anchor section-tint mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <SectionHeading eyebrow={dict.nav.services} title={dict.sections.services_title} icon={Wrench} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 70}>
                <GlassCard className="flex h-full flex-col">
                  <h3 className="line-clamp-2 break-words text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 line-clamp-3 break-words text-sm opacity-80">{service.short_description}</p>
                  <Link href={`/${params.locale}/servicios#${service.slug}`} className="focus-ring group mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand-500 hover:underline">
                    {dict.cta.read_more}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* PROYECTOS */}
      {!!projects?.length && (
        <section id="proyectos" className="section-anchor mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <SectionHeading eyebrow={dict.nav.projects} title={dict.sections.featured_projects} icon={Rocket} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 70}>
                <Link href={`/${params.locale}/proyectos/${project.slug}`}>
                  <GlassCard className="flex h-full flex-col">
                    {project.cover_image_url && (
                      <div className="relative mb-4 h-40 w-full shrink-0 overflow-hidden rounded-xl">
                        <Image src={project.cover_image_url} alt={project.title} fill className="object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    )}
                    <h3 className="line-clamp-2 break-words font-semibold">{project.title}</h3>
                    <p className="mt-2 line-clamp-3 break-words text-sm opacity-80">{project.summary}</p>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href={`/${params.locale}/proyectos`}>
              <GlassButton variant="ghost">{dict.cta.view_all_projects}</GlassButton>
            </Link>
          </Reveal>
        </section>
      )}

      {/* EMPRESAS */}
      {!!partners?.length && (
        <section id="empresas" className="section-anchor mx-auto max-w-6xl px-6 py-14 text-center sm:py-20">
          <SectionHeading title={dict.sections.partners} icon={Building2} />
          <Reveal className="flex flex-wrap items-center justify-center gap-10 opacity-80">
            {partners.map((partner) =>
              partner.website_url ? (
                <a key={partner.id} href={partner.website_url} target="_blank" rel="noopener noreferrer" className="shrink-0 transition-transform hover:scale-105">
                  <Image src={partner.logo_url} alt={partner.name} width={120} height={48} className="h-12 w-auto max-w-[140px] object-contain grayscale transition hover:grayscale-0" />
                </a>
              ) : (
                <Image key={partner.id} src={partner.logo_url} alt={partner.name} width={120} height={48} className="h-12 w-auto max-w-[140px] shrink-0 object-contain grayscale transition hover:grayscale-0" />
              )
            )}
          </Reveal>
        </section>
      )}

      {/* EQUIPO */}
      {!!team?.length && (
        <section id="equipo" className="section-anchor section-tint mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <SectionHeading eyebrow={dict.nav.team} title={dict.sections.team} icon={Users} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 70}>
                <GlassCard className="text-center">
                  {member.photo_url && (
                    <div className="relative mx-auto mb-4 h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-300/30">
                      <Image src={member.photo_url} alt={member.full_name} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="truncate font-semibold">{member.full_name}</h3>
                  <p className="truncate text-sm text-brand-500">{member.role_title}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href={`/${params.locale}/equipo`}>
              <GlassButton variant="ghost">{dict.cta.meet_team}</GlassButton>
            </Link>
          </Reveal>
        </section>
      )}

      {/* RESEÑAS */}
      {!!reviews?.length && (
        <section id="resenas" className="section-anchor mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <SectionHeading eyebrow={dict.nav.reviews} title={dict.sections.featured_reviews} icon={Star} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={i * 70}>
                <GlassCard className="flex h-full flex-col">
                  <div className="flex gap-1 text-yellow-400" aria-label={`${review.rating} de 5 estrellas`}>
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-3 line-clamp-4 break-words text-sm opacity-80">&ldquo;{review.review_text}&rdquo;</p>
                  <p className="mt-auto truncate pt-4 text-sm font-medium">{review.author_name}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {!!posts?.length && (
        <section id="blog" className="section-anchor mx-auto max-w-6xl px-6 py-14 sm:py-20">
          <SectionHeading eyebrow={dict.nav.blog} title={dict.sections.latest_posts} icon={Newspaper} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 70}>
                <Link href={`/${params.locale}/blog/${post.slug}`}>
                  <GlassCard className="flex h-full flex-col">
                    <h3 className="line-clamp-2 break-words font-semibold">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 break-words text-sm opacity-80">{post.excerpt}</p>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {!!faqItems?.length && (
        <section id="faq" className="section-anchor section-tint mx-auto max-w-3xl px-6 py-14 sm:py-20">
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqItems)) }}
          />
          <SectionHeading eyebrow={dict.nav.faq} title={dict.sections.faq} icon={HelpCircle} />
          <Reveal>
            <FaqAccordion items={faqItems} searchPlaceholder={dict.faq_search} showSearch={false} />
          </Reveal>
          <Reveal className="mt-8 text-center">
            <Link href={`/${params.locale}/faq`}>
              <GlassButton variant="ghost">{dict.cta.view_all_faq}</GlassButton>
            </Link>
          </Reveal>
        </section>
      )}

      {/* CONTACTO */}
      <section id="contacto" className="section-anchor mx-auto max-w-2xl px-6 py-14 sm:py-20">
        <SectionHeading eyebrow={dict.nav.contact} title={dict.sections.contact} subtitle={dict.contact_quick.intro} icon={MessageSquare} />
        <Reveal className="mb-8">
          <ContactQuickActions
            labels={{ call: dict.contact_quick.call, whatsapp: dict.contact_quick.whatsapp, email: dict.contact_quick.email }}
          />
        </Reveal>
        <Reveal delay={100}>
          <ContactForm dict={dict.contact_form} locale={params.locale} />
        </Reveal>
      </section>
    </>
  );
}
