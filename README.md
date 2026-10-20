# Muizz — Developer Portfolio

A personal portfolio, résumé, project showcase, and blog, built with Next.js (App Router),
TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for subtle animation
- **next-themes** for dark/light mode
- **MDX** (via `next-mdx-remote`) for the blog
- **Lucide React** for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

### Lint / Format

```bash
npm run lint
npm run format
```

## Editing Content

All personal content is centralized so nothing needs to be hardcoded inside components:

| What                      | Where                                                            |
| ------------------------- | ---------------------------------------------------------------- |
| Name, title, bio, links   | `src/data/profile.ts`                                            |
| Work experience           | `src/data/experience.ts`                                         |
| Projects                  | `src/data/projects.ts`                                           |
| Skills                    | `src/data/skills.ts`                                             |
| Activities / achievements | `src/data/activities.ts`                                         |
| Blog posts                | Sanity Studio at `/admin/blog` (MDX fallback in `content/blog/`) |
| Résumé PDF                | `public/resume.pdf`                                              |

Several entries are intentionally left as placeholders (wrapped in `[brackets]`) where real
information wasn't available — replace these before treating the site as final. Search the
`src/data` folder for `isPlaceholder` and `[Add` to find them all.

### Managing blog posts

Once Sanity is configured, sign in to `/admin/blog` with an account invited to your Sanity project.
Create and edit posts in Markdown, upload cover/inline images, preview the article, and save drafts
or publish/unpublish from the Studio. Only published posts are returned by public blog pages.
Publishing changes revalidate the blog and sitemap through the configured webhook; no application
redeployment is needed.

Before Sanity is configured, the site continues to use the existing files in `content/blog/`.

#### One-time Sanity setup

1. Create a Sanity project and a `production` dataset. Set the dataset's read access to public;
   the site explicitly uses Sanity's `published` perspective and never queries drafts.
2. Add your Sanity account as a project member. Studio authentication and the project's role
   permissions protect all content editing and publishing at `/admin/blog`.
3. In Sanity API settings, add your production portfolio origin and `http://localhost:3000` as
   CORS origins, allowing credentials for Studio authentication.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`. These identify the public
   content dataset and are not privileged credentials.
5. Set the same `NEXT_PUBLIC_` values in the Vercel project's Production, Preview, and Development
   environments as needed.
6. Migrate the existing published MDX posts once. Create a Sanity API token with write access,
   set `SANITY_API_TOKEN` locally (never in a `NEXT_PUBLIC_` variable or the Vercel runtime), then run:

   ```powershell
   $env:SANITY_API_TOKEN = "your-one-time-migration-token"
   npm run blog:migrate
   Remove-Item Env:SANITY_API_TOKEN
   ```

   The importer preserves existing slugs, article Markdown, dates, descriptions, tags, and available
   local cover images. Re-running skips posts that were already imported.

7. In Sanity project settings, create a webhook for the `production` dataset, filtered to
   `_type == "post"`, with create/update/delete events and this projection:

   ```groq
   {"slug": slug}
   ```

   Point it to `https://your-domain.example/api/sanity/revalidate` and configure a custom
   `x-sanity-webhook-secret` header. Set the same strong random value as `SANITY_REVALIDATE_SECRET`
   in Vercel and locally. Redeploy once after setting Vercel environment variables.

`SANITY_API_TOKEN` is needed only for the one-time migration and is never used by the public site.
Keep it out of source control and remove it from the environment after migration.

### Enabling live GitHub repos

Set `NEXT_PUBLIC_GITHUB_USERNAME` in `.env.local` (copy from `.env.example`) to your GitHub
username to have the site attempt to fetch your public repositories. If unset, or if the request
fails, the site falls back to the static project data automatically — no code changes needed.

### Wiring up the contact form

The contact form on `/contact` is UI-complete but not wired to a backend. Point
`NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` at a [Resend](https://resend.com), [Formspree](https://formspree.io),
or Vercel Function endpoint and update the `onSubmit` handler in
`src/components/contact/ContactSection.tsx` to POST to it.

## Deploying to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no build configuration is required.
4. Add the public Sanity project/dataset/API version and server-only
   `SANITY_REVALIDATE_SECRET` from `.env.example` to the Vercel project settings. Do not add
   `SANITY_API_TOKEN` to Vercel.
5. Deploy. Every push to your default branch redeploys automatically.

Until Sanity is configured, the site works with the existing local MDX data. The Sanity write token
is not required by a deployed site.

## Project Structure

```
src/
  app/            # Routes (App Router)
  components/     # UI, layout, and feature components
  data/           # Centralized content (profile, experience, projects, skills, activities)
  lib/            # Utilities (MDX parsing, GitHub fetch, class helpers)
content/
  blog/           # Legacy MDX posts used until Sanity is configured
sanity/             # Sanity Studio schema and Markdown editor
public/
  resume.pdf      # Downloadable résumé
  favicon.svg
```

## License

Personal project — feel free to use the structure/approach as a reference for your own portfolio.
