// @ts-check
import { postReadingTime } from './src/remark-plugins/post-reading-time.mjs';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import svelte from '@astrojs/svelte';
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
    site: 'https://isaaccorbrey.com',
    integrations: [svelte(), tailwind()],
    adapter: netlify(),
    output: 'server',
    redirects: {
        '/n/[...slug]': '/notes/[...slug]',
        '/t/[...slug]': '/tags/[...slug]',
        '/n': '/notes',
    },
    markdown: {
        remarkPlugins: [
            postReadingTime,
            remarkGfm,
        ],
        shikiConfig: {
            wrap: true,
        }
    }
});
