import type { Heading } from '@/lib/toc';

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-raised to-surface p-5 shadow-lg shadow-foreground/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">In this article</p>
        <span className="font-mono text-[0.65rem] text-indigo-600 dark:text-indigo-300">
          {String(headings.length).padStart(2, '0')}
        </span>
      </div>
      <ul className="space-y-1.5 text-sm">
        {headings.map((heading, index) => (
          <li key={heading.slug} className={heading.depth === 3 ? 'pl-3' : ''}>
            <a
              href={`#${heading.slug}`}
              className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-muted transition-colors hover:bg-indigo-500/[0.06] hover:text-foreground"
            >
              <span className="mt-0.5 font-mono text-[0.65rem] text-indigo-500/70 transition-colors group-hover:text-indigo-500 dark:text-indigo-300/70">
                {String(index + 1).padStart(2, '0')}
              </span>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
