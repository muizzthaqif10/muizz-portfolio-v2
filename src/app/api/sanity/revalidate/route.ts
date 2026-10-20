import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const supplied = request.headers.get('x-sanity-webhook-secret');

  if (!secret) {
    return Response.json({ message: 'Revalidation is not configured' }, { status: 503 });
  }
  if (!supplied) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const expectedBuffer = Buffer.from(secret);
  const suppliedBuffer = Buffer.from(supplied);
  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let payload: { slug?: { current?: string } };
  try {
    payload = (await request.json()) as { slug?: { current?: string } };
  } catch {
    return Response.json({ message: 'Invalid JSON payload' }, { status: 400 });
  }
  revalidatePath('/blog');
  revalidatePath('/');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');
  if (payload.slug?.current && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug.current)) {
    revalidatePath(`/blog/${payload.slug.current}`);
  }

  return Response.json({ revalidated: true });
}
