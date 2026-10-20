import type { Metadata } from 'next';
import { sanityConfigured } from '@/lib/sanity';
import { BlogStudio } from './Studio';

export const metadata: Metadata = {
  title: 'Blog CMS',
  robots: { index: false, follow: false },
};

export default function BlogStudioPage() {
  if (!sanityConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-foreground">
          Sanity is not configured
        </h1>
        <p className="mt-3 text-muted">
          Set the Sanity project ID and dataset in your environment, then restart the
          application to open the blog editor.
        </p>
      </div>
    );
  }

  return <BlogStudio />;
}
