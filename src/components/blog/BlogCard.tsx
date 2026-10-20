import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, Clock3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { PostMeta } from '@/lib/mdx';

export function BlogCard({
  post,
  featured = false,
}: {
  post: PostMeta;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-raised to-surface shadow-lg shadow-foreground/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/[0.06] ${
        featured
          ? 'gap-5 p-3 sm:col-span-2 sm:grid sm:grid-cols-[0.9fr_1.1fr] sm:items-stretch sm:gap-0 sm:p-3'
          : 'p-5'
      }`}
    >
      {featured && !post.cover && (
        <div className="relative flex min-h-52 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 p-6 text-white sm:min-h-72 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(circle at 78% 22%, rgba(129, 140, 248, 0.8), transparent 34%), radial-gradient(circle at 20% 88%, rgba(45, 212, 191, 0.55), transparent 36%)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              Field notes
            </span>
            <BookOpen size={18} className="text-teal-200" />
          </div>
          <div className="relative">
            <span className="block font-display text-7xl font-semibold leading-none tracking-tight text-white/90 sm:text-8xl">
              01
            </span>
            <span className="mt-3 block font-mono text-xs uppercase tracking-[0.18em] text-white/60">
              Engineering journal
            </span>
          </div>
          <div
            className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full border border-white/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -right-2 h-40 w-40 rounded-full border border-white/10"
            aria-hidden="true"
          />
        </div>
      )}
      {post.cover && (
        <div
          className={`relative aspect-[16/9] overflow-hidden bg-background ${
            featured
              ? '-mx-3 -mt-3 rounded-t-2xl sm:m-0 sm:aspect-auto sm:min-h-72 sm:rounded-xl'
              : '-mx-5 -mt-5 mb-4 rounded-t-2xl'
          }`}
        >
          <Image
            src={post.cover}
            alt={post.coverAlt || ''}
            fill
            sizes={
              featured
                ? '(max-width: 640px) 100vw, 66vw'
                : '(max-width: 640px) 100vw, 50vw'
            }
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className={`flex min-w-0 flex-1 flex-col ${featured ? 'p-2 sm:justify-center sm:px-8 sm:py-7' : ''}`}>
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="text-border-strong">/</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} />
            {post.readingTime}
          </span>
          {post.category && (
            <span className="ml-auto rounded-full border border-indigo-500/25 bg-indigo-500/[0.06] px-2.5 py-1 text-indigo-700 dark:text-indigo-300">
              {post.category}
            </span>
          )}
        </div>
        <h3
          className={`font-semibold leading-tight text-foreground transition-colors group-hover:text-accent ${
            featured ? 'text-2xl sm:text-3xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h3>
        <p className={`mt-3 text-sm leading-relaxed text-muted ${featured ? 'sm:text-base' : ''}`}>
          {post.description}
        </p>

        {post.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, featured ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[0.68rem] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="mt-6 inline-flex w-fit items-center gap-2 border-b border-accent/30 pb-1 text-sm font-medium text-accent transition-all group-hover:gap-3 group-hover:border-accent">
          Read article
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}
