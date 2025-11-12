import { z, defineCollection, reference } from "astro:content";
import { glob } from 'astro/loaders';

// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/blog" }),
    schema: z.object({
      title: z.string().min(1),
      subtitle: z.string().optional(),
      publish_date: z.preprocess((arg) => {
        if (typeof arg === 'string' || typeof arg === 'number') return new Date(arg);
        return arg;
      }, z.date()),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional().default(false),
      author: reference('authors'),
      images: z.array(
        z.object({
          src: z.string().min(1),
          alt: z.string().optional(),
          caption: z.string().optional(),
          width: z.number().int().optional(),
          height: z.number().int().optional(),
        })
      ).optional().default([]),
    })
});

const authors = defineCollection({ 
  loader: glob({pattern: '**/*.json', base: "./src/content/authors" }),
  schema: z.object({
    first_name: z.string(),
    last_name: z.string(),
    role: z.string().optional(),
    bio: z.string(),
    avatar: z.string().url().optional(),
    })
 });


// Export a single `collections` object to register your collection(s)
export const collections = { blog, authors };