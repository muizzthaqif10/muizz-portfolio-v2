'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { PatchEvent, set, useClient, useFormValue, type StringInputProps } from 'sanity';

function objectField(value: unknown, key: string): unknown {
  if (typeof value !== 'object' || value === null || !(key in value)) return undefined;
  return (value as Record<string, unknown>)[key];
}

export function MarkdownInput(props: StringInputProps) {
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const contentRef = useRef(props.value ?? '');
  const client = useClient({
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-14',
  });
  const value = props.value ?? '';
  const titleValue = useFormValue(['title']);
  const descriptionValue = useFormValue(['description']);
  const categoryValue = useFormValue(['category']);
  const dateValue = useFormValue(['publishedAt']);
  const tagsValue = useFormValue(['tags']);
  const coverValue = useFormValue(['coverImage']);
  const coverAssetId = objectField(objectField(coverValue, 'asset'), '_ref');
  const coverAltValue = objectField(coverValue, 'alt');
  const [coverResult, setCoverResult] = useState<{
    assetId: string;
    url?: string;
    error?: string;
  }>();
  const coverUrl =
    typeof coverAssetId === 'string' && coverResult?.assetId === coverAssetId
      ? coverResult.url
      : undefined;
  const coverError =
    typeof coverAssetId === 'string' && coverResult?.assetId === coverAssetId
      ? coverResult.error
      : undefined;

  useEffect(() => {
    contentRef.current = value;
  }, [value]);

  useEffect(() => {
    if (typeof coverAssetId !== 'string') return;

    let active = true;
    void client
      .fetch<string | null>('*[_id == $assetId][0].url', { assetId: coverAssetId })
      .then((url) => {
        if (active) setCoverResult({ assetId: coverAssetId, url: url ?? undefined });
      })
      .catch((error: unknown) => {
        if (active) {
          setCoverResult({
            assetId: coverAssetId,
            error:
              error instanceof Error
                ? error.message
                : 'Cover preview could not be loaded.',
          });
        }
      });
    return () => {
      active = false;
    };
  }, [client, coverAssetId]);

  async function uploadImage(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const asset = await client.assets.upload('image', file, { filename: file.name });
      const alt = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/[\[\]\\]/g, '\\$&');
      const currentContent = contentRef.current;
      const imageMarkdown = `${currentContent.trim() ? `${currentContent.trimEnd()}\n\n` : ''}![${alt}](${asset.url})`;
      contentRef.current = imageMarkdown;
      props.onChange(PatchEvent.from(set(imageMarkdown)));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <button
          type="button"
          aria-pressed={!preview}
          onClick={() => setPreview(false)}
          className="rounded-md border border-border px-3 py-1.5 text-sm aria-pressed:border-accent aria-pressed:text-accent"
        >
          Write
        </button>
        <button
          type="button"
          aria-pressed={preview}
          onClick={() => setPreview(true)}
          className="rounded-md border border-border px-3 py-1.5 text-sm aria-pressed:border-accent aria-pressed:text-accent"
        >
          Preview
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground disabled:opacity-60"
        >
          {uploading ? 'Uploading image…' : 'Insert image'}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Upload an image into the article"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) void uploadImage(file);
            event.currentTarget.value = '';
          }}
        />
      </div>
      {uploadError && (
        <p role="alert" className="text-sm text-danger">
          {uploadError}
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <textarea
          {...props.elementProps}
          id={props.id}
          value={value}
          onChange={(event) => {
            contentRef.current = event.currentTarget.value;
            props.onChange(PatchEvent.from(set(event.currentTarget.value)));
          }}
          readOnly={props.readOnly}
          required={props.validation?.some((marker) => marker.level === 'error')}
          aria-label="Article Markdown"
          spellCheck={false}
          className={`min-h-[28rem] w-full resize-y rounded-lg border border-border bg-background p-4 font-mono text-sm leading-6 text-foreground outline-none focus-visible:border-accent ${
            preview ? 'hidden md:block' : ''
          }`}
          placeholder={
            '# Your article\n\nWrite in Markdown. Fenced code blocks are syntax highlighted in the preview.'
          }
        />
        <div
          aria-label="Live Markdown preview"
          className={`prose-post min-h-64 rounded-lg border border-border bg-surface p-5 ${
            preview ? 'block' : 'hidden md:block'
          }`}
        >
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={typeof coverAltValue === 'string' ? coverAltValue : ''}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="mb-6 aspect-[16/9] w-full rounded-lg object-cover"
            />
          )}
          {coverError && (
            <p role="alert" className="mb-3 text-sm text-danger">
              {coverError}
            </p>
          )}
          {typeof titleValue === 'string' && (
            <h1 className="mb-3 text-3xl font-semibold text-foreground">
              {titleValue || 'Untitled article'}
            </h1>
          )}
          <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
            {typeof categoryValue === 'string' && categoryValue && (
              <span>{categoryValue}</span>
            )}
            {typeof dateValue === 'string' && <time>{dateValue}</time>}
            {Array.isArray(tagsValue) &&
              tagsValue
                .filter((tag): tag is string => typeof tag === 'string')
                .map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
          {typeof descriptionValue === 'string' && (
            <p className="mb-6 text-lg text-muted">{descriptionValue}</p>
          )}
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-muted">Nothing to preview yet.</p>
          )}
        </div>
      </div>
      <p className="text-xs text-muted">
        Markdown with tables, task lists, blockquotes, fenced code, and uploaded inline
        images is supported.
      </p>
    </div>
  );
}
