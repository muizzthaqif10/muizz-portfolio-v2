import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
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
      className={`group relative flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/50 ${
        featured ? 'sm:col-span-2' : ''
      }`}
    >
      {post.cover && (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[16/9] overflow-hidden rounded-t-xl bg-background">
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
      <div className="mb-3 flex items-center gap-3 font-mono text-xs text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTime}</span>
      </div>
      {post.category && (
        <span className="mb-2 w-fit rounded-md border border-accent/30 px-2 py-0.5 font-mono text-xs text-accent">
          {post.category}
        </span>
      )}
      <h3
        className={`font-semibold text-foreground group-hover:text-accent ${featured ? 'text-xl' : 'text-base'}`}
      >
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{post.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent">
        Read post
        <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}
