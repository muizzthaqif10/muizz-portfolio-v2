import Link from 'next/link';
import { ArrowUpRight, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TechBadge } from '@/components/ui/TechBadge';
import type { Project } from '@/data/projects';
import { GithubIcon } from '@/components/icons/BrandIcons';

const statusStyles: Record<
  Project['status'],
  { badge: string; card: string; accent: string }
> = {
  Live: {
    badge: 'border-sky-500/30 bg-sky-500/5 text-sky-700 dark:text-sky-300',
    card: 'border-t-sky-500/70 hover:border-sky-400/50 hover:shadow-sky-500/10',
    accent: 'text-sky-700 dark:text-sky-300',
  },
  'In Progress': {
    badge: 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300',
    card: 'border-t-amber-500/70 hover:border-amber-400/50 hover:shadow-amber-500/10',
    accent: 'text-amber-700 dark:text-amber-300',
  },
  'Case Study': {
    badge: 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300',
    card: 'border-t-violet-500/70 hover:border-violet-400/50 hover:shadow-violet-500/10',
    accent: 'text-violet-700 dark:text-violet-300',
  },
  Archived: {
    badge: 'border-slate-500/30 bg-slate-500/5 text-slate-600 dark:text-slate-300',
    card: 'border-t-slate-400/70 hover:border-slate-400/50 hover:shadow-slate-500/10',
    accent: 'text-slate-700 dark:text-slate-300',
  },
  Planned: {
    badge: 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300',
    card: 'border-t-rose-500/70 hover:border-rose-400/50 hover:shadow-rose-500/10',
    accent: 'text-rose-700 dark:text-rose-300',
  },
};

export function ProjectCard({ project }: { project: Project }) {
  const styles = statusStyles[project.status];

  return (
    <div
      className={`project-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-t-2 border-border bg-gradient-to-b from-surface-raised to-surface p-5 shadow-lg shadow-foreground/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.card}`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full border border-current opacity-[0.06] transition-transform duration-500 group-hover:scale-125"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-current to-transparent opacity-[0.035]"
        aria-hidden
      />
      <div className="mb-3 flex items-start justify-between gap-3">
        <Badge className={styles.badge}>{project.status}</Badge>
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} on GitHub`}
            className="text-muted transition-colors hover:text-foreground"
          >
            <GithubIcon size={16} />
          </a>
        ) : (
          !project.isPlaceholder && (
            <span
              className="flex items-center gap-1 text-xs text-muted"
              title="Private / confidential work"
            >
              <Lock size={13} />
            </span>
          )
        )}
      </div>

      <h3 className="min-h-12 text-base font-semibold leading-6 text-foreground">
        <Link
          href={`/projects/${project.slug}`}
          className={`relative z-[1] transition-colors ${styles.accent}`}
        >
          <span className="absolute inset-0" aria-hidden />
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.categories.slice(0, 3).map((category) => (
          <span
            key={category}
            className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[0.65rem] text-muted"
          >
            {category}
          </span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-border/80 py-3 text-xs">
        <div>
          <dt className="font-mono uppercase tracking-wide text-muted">Type</dt>
          <dd className="mt-1 text-foreground">{project.type}</dd>
        </div>
        <div>
          <dt className="font-mono uppercase tracking-wide text-muted">Timeline</dt>
          <dd className="mt-1 text-foreground">{project.year}</dd>
        </div>
      </dl>

      <div className="mt-4 flex h-[3.75rem] flex-wrap content-start gap-1.5 overflow-hidden">
        {project.stack.slice(0, 4).map((tech) => (
          <TechBadge key={tech} label={tech} />
        ))}
      </div>

      <div
        className={`mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium transition-transform group-hover:translate-x-1 ${styles.accent}`}
      >
        View case study
        <ArrowUpRight size={14} />
      </div>
    </div>
  );
}
