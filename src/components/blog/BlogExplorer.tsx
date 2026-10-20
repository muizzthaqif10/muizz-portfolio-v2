'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostMeta } from '@/lib/mdx';
import { BlogGrid } from './BlogGrid';

export function BlogExplorer({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags?.includes(activeTag);
      const matchesQuery =
        query.trim() === '' ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase());
      return matchesTag && matchesQuery;
    });
  }, [posts, activeTag, query]);

  return (
    <div>
      <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-border bg-surface/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              !activeTag
                ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                : 'border-border bg-background/50 text-muted hover:border-indigo-500/30 hover:text-foreground',
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                activeTag === tag
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                  : 'border-border bg-background/50 text-muted hover:border-indigo-500/30 hover:text-foreground',
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            aria-label="Search blog posts"
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus-visible:border-indigo-500"
          />
        </div>
      </div>

      <BlogGrid posts={filtered} />
    </div>
  );
}
