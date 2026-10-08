import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each service is one Markdown file => one slide. Editable in the CMS (/admin)
// or by hand. `image()` makes Astro optimise the uploaded image automatically.
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      intro: z.string(),
      bullets: z.array(z.string()).min(1),
      image: image(),
      imageAlt: z.string(),
      note: z.string().optional(),
    }),
});

export const collections = { services };
