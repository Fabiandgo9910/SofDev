import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/glass/glass-card";

async function getPost(locale: Locale, slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("locale", locale)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.locale, params.slug);
  if (!post) return {};
  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt,
    openGraph: { images: post.cover_image_url ? [post.cover_image_url] : [] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const post = await getPost(params.locale, params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <GlassCard>
        {post.cover_image_url && (
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.published_at && (
          <time className="mt-2 block text-sm opacity-60" dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString(params.locale)}
          </time>
        )}
        <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line dark:prose-invert">
          {post.content}
        </div>
      </GlassCard>
    </article>
  );
}
