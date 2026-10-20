import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, Clock3 } from 'lucide-react';
import { PageLayout } from '@/components/ui/PageLayout';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { markdownComponents } from '@/components/blog/markdown-components';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/mdx';
import { extractHeadings } from '@/lib/toc';
import { formatDate } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      type: 'article',
      publishedTime: post.date,
      images: post.socialImage
        ? [post.socialImage]
        : post.cover
          ? [post.cover]
          : undefined,
    },
    twitter: {
      card: post.socialImage || post.cover ? 'summary_large_image' : 'summary',
      images:
        post.socialImage || post.cover ? [post.socialImage || post.cover!] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const related = await getRelatedPosts(post);

  return (
    <PageLayout>
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
      >
        <ArrowLeft size={15} />
        All writing
      </Link>

      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14">
        <article className="min-w-0">
          <header className="relative mb-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-raised via-surface to-indigo-500/[0.06] p-6 sm:mb-10 sm:p-9">
            <div
              className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-indigo-500/[0.08] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              {post.category && (
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/[0.06] px-3 py-1.5 font-mono text-xs text-indigo-700 dark:text-indigo-300">
                  <BookOpen size={13} />
                  {post.category}
                </span>
              )}

              <h1 className="break-words font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
                {post.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border/80 pt-5 font-mono text-xs text-muted">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-indigo-500 dark:text-indigo-300" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={14} className="text-teal-600 dark:text-teal-300" />
                  {post.readingTime}
                </span>
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {post.cover && (
            <figure className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-foreground/[0.06]">
              <Image
                src={post.cover}
                alt={post.coverAlt || ''}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 720px"
                className="object-cover"
              />
            </figure>
          )}

          <div className="prose-post">
            {post.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            ) : (
              <p className="text-muted">This article does not have any content yet.</p>
            )}
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-10" aria-labelledby="related-posts-heading">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">
                    Continue reading
                  </p>
                  <h2 id="related-posts-heading" className="font-display text-xl font-semibold text-foreground">
                    Related articles
                  </h2>
                </div>
                <ArrowUpRight size={18} className="text-muted" />
              </div>
              <BlogGrid posts={related} />
            </section>
          )}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
