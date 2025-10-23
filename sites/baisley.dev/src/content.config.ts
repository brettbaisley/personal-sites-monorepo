import { z, defineCollection, reference } from "astro:content";
import { glob } from 'astro/loaders';

// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/blog" }),
    schema: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      pubDate: z.date(),
      description: z.string(),
      author: reference('authors'),
    })
});

const authors = defineCollection({ 
  loader: glob({pattern: '**/*.json', base: "./src/content/authors" }),
  schema: z.object({
    first_name: z.string(),
    last_name: z.string(),
    role: z.string().optional(),
    bio: z.string()
    })
 });


// Export a single `collections` object to register your collection(s)
export const collections = { blog, authors };