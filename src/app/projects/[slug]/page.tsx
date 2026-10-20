import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Lock,
} from 'lucide-react';
import { PageLayout } from '@/components/ui/PageLayout';
import { Badge } from '@/components/ui/Badge';
import { TechBadge } from '@/components/ui/TechBadge';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { projects } from '@/data/projects';
import { GithubIcon } from '@/components/icons/BrandIcons';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
  };
}

const statusTone: Record<string, 'signal' | 'amber' | 'accent' | 'muted'> = {
  Live: 'signal',
  'In Progress': 'amber',
  'Case Study': 'accent',
  Archived: 'muted',
  Planned: 'muted',
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const sections: { title: string; content?: string }[] = [
    { title: 'Problem', content: project.problem },
    { title: 'Solution', content: project.solution },
    { title: 'Implementation', content: project.implementation },
    { title: 'Challenges', content: project.challenges },
    { title: 'What I Learned', content: project.learnings },
    { title: 'Future Improvements', content: project.futureImprovements },
  ];

  return (
    <PageLayout className="max-w-5xl">
      <Link
        href="/projects"
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-sm text-muted transition-all hover:border-accent/40 hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to projects
      </Link>

      <header className="project-detail-hero relative mb-12 overflow-hidden rounded-3xl border border-border p-6 shadow-xl shadow-violet-950/[0.06] sm:p-9 lg:p-11">
        <div
          className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border border-violet/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-7 -top-12 size-56 rounded-full border border-aqua/15"
          aria-hidden
        />
        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[project.status]}>{project.status}</Badge>
            {project.categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-xs text-muted"
              >
                {category}
              </span>
            ))}
          </div>

          <h1 className="max-w-4xl break-words font-display text-3xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {project.description}
          </p>
          {project.longDescription && (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
              {project.longDescription}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-background/60 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent/50 hover:bg-surface-raised"
              >
                <GithubIcon size={15} />
                GitHub
              </a>
            ) : (
              !project.isPlaceholder && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2.5 text-sm text-muted">
                  <Lock size={14} />
                  Private / confidential
                </span>
              )
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                Live Demo
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/55 p-3.5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-violet/10 text-violet">
                <BriefcaseBusiness size={17} />
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                  Project type
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{project.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/55 p-3.5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-aqua/10 text-aqua">
                <CalendarDays size={17} />
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                  Timeline
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{project.year}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        className="mb-12 rounded-2xl border border-border bg-surface/60 p-5 shadow-lg shadow-foreground/[0.02] sm:p-6"
        aria-labelledby="project-stack-heading"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.14em] text-aqua">
              Tools &amp; technologies
            </p>
            <h2
              id="project-stack-heading"
              className="font-display text-lg font-semibold text-foreground"
            >
              Project stack
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {String(project.stack.length).padStart(2, '0')} technologies
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>
      </section>

      {project.relatedRepos && project.relatedRepos.length > 0 && (
        <section className="section-tint-violet mb-12 rounded-2xl border border-border p-5 sm:p-6">
          <h2 className="mb-4 font-mono text-sm text-accent">
            <span className="text-muted">{'// '}</span>
            related repositories
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.relatedRepos.map((repo) => (
              <a
                key={repo.url}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-border-strong px-4 py-2 text-sm text-foreground hover:bg-surface-raised"
              >
                <GithubIcon size={15} />
                {repo.name}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </section>
      )}

      {project.architecture && project.architecture.length > 0 && (
        <section className="mb-12 rounded-2xl border border-border bg-surface/55 p-5 sm:p-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-violet">
            System overview
          </p>
          <h2 className="mb-5 font-display text-xl font-semibold text-foreground">
            <span className="text-muted">{'// '}</span>
            Architecture
          </h2>
          <ArchitectureDiagram nodes={project.architecture} />
        </section>
      )}

      <section className="mb-12">
        <div className="mb-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-coral">
            Inside the project
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            From problem to outcome
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections
            .filter((section) => section.content)
            .map((section, index) => (
              <article
                key={section.title}
                className={`project-story-card rounded-2xl border border-t-2 bg-surface/65 p-5 sm:p-6 ${['border-t-violet-400', 'border-t-aqua-400', 'border-t-amber-400', 'border-t-coral-400'][index % 4]}`}
              >
                <p className="mb-4 font-mono text-xs text-muted">
                  0{index + 1} <span className="text-border-strong">/</span> PROJECT NOTES
                </p>
                <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                  {section.title}
                </h3>
                <p className="leading-relaxed text-muted">{section.content}</p>
              </article>
            ))}
        </div>
      </section>
    </PageLayout>
  );
}
