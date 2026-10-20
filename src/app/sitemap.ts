import type { MetadataRoute } from 'next';
import { seo } from '@/data/profile';
import { projects } from '@/data/projects';
import { getAllPosts } from '@/lib/mdx';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about',
    '/experience',
    '/projects',
    '/skills',
    '/resume',
    '/blog',
    '/activities',
    '/contact',
    '/uses',
  ].map((route) => ({
    url: `${seo.url}${route}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${seo.url}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const postRoutes = (await getAllPosts()).map((post) => ({
    url: `${seo.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
