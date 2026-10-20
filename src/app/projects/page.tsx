import type { Metadata } from 'next';
import { PageLayout } from '@/components/ui/PageLayout';
import { ProjectsExplorer } from '@/components/projects/ProjectsExplorer';
import { GithubReposSection } from '@/components/projects/GithubReposSection';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { ArrowDown, BriefcaseBusiness, Layers3, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Projects',
  description: `Project showcase for ${profile.fullName} — integration case studies, learning projects and internship work.`,
};

export default function ProjectsPage() {
  const companyProjects = projects.filter((project) => project.type === 'Company').length;
  const personalProjects = projects.filter(
    (project) => project.type === 'Personal/Freelance',
  ).length;

  return (
    <PageLayout>
      <header className="projects-hero relative mb-12 overflow-hidden rounded-3xl border border-border p-7 shadow-xl shadow-violet-950/[0.06] sm:mb-16 sm:p-10 lg:p-12">
        <div
          className="projects-hero-orbit pointer-events-none absolute -right-20 -top-32 size-96 rounded-full border border-violet/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-7 -top-20 size-72 rounded-full border border-aqua/15"
          aria-hidden
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet/25 bg-violet/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-violet">
              <Sparkles size={13} />
              selected work &amp; experiments
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Projects built to
              <span className="hero-title-accent block">solve real problems.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              A collection of engineering case studies, client work, and personal
              projects. Company work is generalized where needed to respect
              confidentiality.
            </p>
            <a
              href="#project-list"
              className="mt-7 inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              Explore the projects
              <ArrowDown size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-32 rounded-2xl border border-border bg-background/65 p-4 backdrop-blur-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
                <Layers3 size={19} />
              </span>
              <p className="font-display text-3xl font-semibold text-foreground">
                {String(projects.length).padStart(2, '0')}
              </p>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                projects
              </p>
            </div>
            <div className="min-w-32 rounded-2xl border border-border bg-background/65 p-4 backdrop-blur-sm">
              <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-aqua/10 text-aqua">
                <BriefcaseBusiness size={19} />
              </span>
              <p className="font-display text-3xl font-semibold text-foreground">
                {String(companyProjects).padStart(2, '0')}
                <span className="mx-1 text-border-strong">/</span>
                <span className="text-aqua">
                  {String(personalProjects).padStart(2, '0')}
                </span>
              </p>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                company / personal
              </p>
            </div>
          </div>
        </div>
      </header>
      <div id="project-list" className="scroll-mt-24">
        <ProjectsExplorer projects={projects} />
      </div>
      <GithubReposSection />
    </PageLayout>
  );
}
