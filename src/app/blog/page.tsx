import type { Metadata } from 'next';
import { PageLayout } from '@/components/ui/PageLayout';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { getAllPosts } from '@/lib/mdx';
import { profile } from '@/data/profile';
import { ArrowDown, BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Writing from ${profile.fullName} on backend engineering, integration and infrastructure.`,
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort();
  const [featured, ...rest] = posts;

  return (
    <PageLayout>
      <header className="relative mb-12 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-raised via-surface to-indigo-500/[0.07] p-7 shadow-xl shadow-foreground/[0.03] sm:mb-16 sm:p-10 lg:p-12">
        <div
          className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-indigo-500/[0.08] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-teal-500/[0.07] blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
              <Sparkles size={13} />
              The engineering journal
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Notes, ideas &
              <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 bg-clip-text text-transparent">
                things worth sharing.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              A personal blog for sharing my notes, knowledge, ideas, articles, issues I work through,
              and news I find worth passing along.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start rounded-2xl border border-border bg-background/60 p-4 lg:self-end">
            <span className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
              <BookOpen size={21} />
            </span>
            <div>
              <p className="font-display text-2xl font-semibold text-foreground">
                {String(posts.length).padStart(2, '0')}
              </p>
              <p className="font-mono text-[0.68rem] uppercase tracking-wider text-muted">
                {posts.length === 1 ? 'published article' : 'published articles'}
              </p>
            </div>
          </div>
        </div>
        <a
          href="#latest-writing"
          className="relative mt-8 inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          Explore the writing
          <ArrowDown size={14} />
        </a>
      </header>

      {featured && (
        <section id="latest-writing" className="mb-12 scroll-mt-24 sm:mb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">
                Start here
              </p>
              <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                Latest writing
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-muted sm:block">
              {String(posts.length).padStart(2, '0')} / ARTICLES
            </span>
          </div>
          <BlogCard post={featured} featured />
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="more-writing-heading">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Keep exploring
              </p>
              <h2 id="more-writing-heading" className="font-display text-xl font-semibold text-foreground">
                More articles
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">{rest.length} more</span>
          </div>
          <BlogExplorer posts={rest} tags={tags} />
        </section>
      )}

      {!featured && <BlogExplorer posts={[]} tags={[]} />}
    </PageLayout>
  );
}
