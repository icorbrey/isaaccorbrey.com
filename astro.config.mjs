// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import svelte from '@astrojs/svelte';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), mdx()],
  adapter: netlify(),
  output: 'server',
  markdown: {
    shikiConfig: {
      wrap: true,
    }
  }
});
