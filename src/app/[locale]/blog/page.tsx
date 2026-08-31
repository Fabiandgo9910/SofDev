import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { Newspaper } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  return buildMetadata({ locale: params.locale, path: "/blog", title: "Blog", description: "Artículos y novedades sobre tecnología, desarrollo y consultoría." });
}

export default async function BlogPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, published_at")
    .eq("locale", params.locale)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading align="left" title={dict.nav.blog} icon={Newspaper} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post, i) => (
          <Reveal key={post.id} delay={i * 60}>
          <Link href={`/${params.locale}/blog/${post.slug}`}>
            <GlassCard className="flex h-full flex-col">
              {post.cover_image_url && (
                <div className="relative mb-4 h-40 w-full shrink-0 overflow-hidden rounded-xl">
                  <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <h3 className="line-clamp-2 break-words font-semibold">{post.title}</h3>
              <p className="mt-2 line-clamp-3 break-words text-sm opacity-80">{post.excerpt}</p>
              {post.published_at && (
                <time className="mt-3 block text-xs opacity-60" dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString(params.locale)}
                </time>
              )}
            </GlassCard>
          </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
