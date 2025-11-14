// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The canonical site URL is required by some integrations (like @astrojs/sitemap).
  // Change this to your site's production URL if different.
  site: 'https://baisley.dev',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});