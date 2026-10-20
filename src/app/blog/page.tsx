import type { Metadata } from 'next';
import { PageLayout } from '@/components/ui/PageLayout';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { getAllPosts } from '@/lib/mdx';
import { profile } from '@/data/profile';

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
      <SectionHeading
        eyebrow="writing"
        title="Blog"
        description="Notes on backend engineering, integration debugging, and things I'm learning along the way."
      />

      {featured && (
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs text-muted">Featured</p>
          <BlogCard post={featured} featured />
        </div>
      )}

      <BlogExplorer posts={rest} tags={tags} />
    </PageLayout>
  );
}
