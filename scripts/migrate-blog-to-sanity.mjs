import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error(
    'Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN before migrating posts.',
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-14',
  token,
  useCdn: false,
});

const blogDirectory = path.join(process.cwd(), 'content', 'blog');
const publicDirectory = path.resolve(process.cwd(), 'public');
const files = fs.readdirSync(blogDirectory).filter((file) => file.endsWith('.mdx'));

for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(blogDirectory, file), 'utf8');
  const { data, content } = matter(raw);
  if (data.draft) {
    console.log(`Skipped draft ${slug}`);
    continue;
  }
  if (!data.title || !data.description || !data.date || !content.trim()) {
    throw new Error(
      `Cannot migrate ${file}: title, description, date, and body are required.`,
    );
  }
  const documentId = `post-${slug}`;
  const existing = await client.fetch('*[_id == $id][0]._id', { id: documentId });
  if (existing) {
    console.log(`Skipped existing ${slug}`);
    continue;
  }
  const coverImage = await uploadCover(data.cover, data.title);
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag) => typeof tag === 'string')
    : [];

  const document = {
    _id: documentId,
    _type: 'post',
    title: data.title,
    slug: { _type: 'slug', current: slug },
    description: data.description,
    category: data.category || tags[0] || 'Writing',
    tags,
    publishedAt: new Date(`${data.date}T12:00:00.000Z`).toISOString(),
    body: content.trim(),
    ...(coverImage ? { coverImage } : {}),
    ...(data.seoTitle ? { seoTitle: data.seoTitle } : {}),
    ...(data.seoDescription ? { seoDescription: data.seoDescription } : {}),
  };

  await client.createOrReplace(document);
  console.log(`Migrated ${slug}`);
}

async function uploadCover(cover, title) {
  if (typeof cover !== 'string' || !cover.startsWith('/')) return undefined;
  const filePath = path.resolve(publicDirectory, cover.replace(/^[/\\]+/, ''));
  if (!filePath.startsWith(`${publicDirectory}${path.sep}`) || !fs.existsSync(filePath)) {
    throw new Error(`Cover image not found inside public/: ${cover}`);
  }

  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt: typeof title === 'string' ? title : '',
  };
}
