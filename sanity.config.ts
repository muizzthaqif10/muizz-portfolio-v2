import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { postSchema } from './sanity/schemas/post';

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/admin/blog',
  plugins: [structureTool()],
  schema: {
    types: [postSchema],
  },
});
