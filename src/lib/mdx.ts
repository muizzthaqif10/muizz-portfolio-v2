import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { sanityClient } from './sanity';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  description,
  "date": publishedAt,
  category,
  tags,
  "cover": coverImage.asset->url,
  "coverAlt": coverImage.alt,
  body,
  seoTitle,
  seoDescription,
  "socialImage": socialImage.asset->url,
  "_updatedAt": _updatedAt
}`;

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  category?: string;
  cover?: string;
  coverAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
  updatedAt?: string;
};

export type Post = PostMeta & {
  content: string;
};

type SanityPost = Omit<PostMeta, 'readingTime'> & {
  body?: string;
  _updatedAt?: string;
};

function getMdxFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));
}

function getLocalPosts(): Post[] {
  return getMdxFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { data, content } = matter(raw);
      const frontmatter = data as PostFrontmatter;

      return {
        ...frontmatter,
        slug,
        readingTime: readingTime(content).text,
        content,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function fromSanity(post: SanityPost): Post {
  const content = post.body ?? '';
  return {
    ...post,
    description: post.description ?? '',
    date: post.date,
    tags: post.tags ?? [],
    category: post.category,
    readingTime: readingTime(content).text,
    updatedAt: post._updatedAt,
    content,
  };
}

function toPostMeta(post: Post): PostMeta {
  return {
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    category: post.category,
    cover: post.cover,
    coverAlt: post.coverAlt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    socialImage: post.socialImage,
    draft: post.draft,
    slug: post.slug,
    readingTime: post.readingTime,
    updatedAt: post.updatedAt,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  if (!sanityClient) {
    return getLocalPosts().map(toPostMeta);
  }

  const posts = await sanityClient.fetch<SanityPost[]>(
    POSTS_QUERY,
    {},
    { next: { revalidate: 3600, tags: ['sanity:blog'] } },
  );
  return posts.map((post) => toPostMeta(fromSanity(post)));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  if (sanityClient) {
    const post = await sanityClient.fetch<SanityPost | null>(
      `*[_type == "post" && slug.current == $slug && defined(publishedAt) && !(_id in path("drafts.**"))][0] {
        title,
        "slug": slug.current,
        description,
        "date": publishedAt,
        category,
        tags,
        "cover": coverImage.asset->url,
        "coverAlt": coverImage.alt,
        body,
        seoTitle,
        seoDescription,
        "socialImage": socialImage.asset->url,
        "_updatedAt": _updatedAt
      }`,
      { slug },
      { next: { revalidate: 3600, tags: ['sanity:blog', `sanity:post:${slug}`] } },
    );
    return post ? fromSanity(post) : null;
  }

  const post = getLocalPosts().find((item) => item.slug === slug);
  return post ?? null;
}

export async function getRelatedPosts(current: PostMeta, limit = 2): Promise<PostMeta[]> {
  return (await getAllPosts())
    .filter((post) => post.slug !== current.slug)
    .filter((post) => post.tags?.some((tag) => current.tags?.includes(tag)))
    .slice(0, limit);
}
