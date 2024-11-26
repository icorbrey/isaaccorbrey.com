// @ts-check
import { postReadingTime } from './src/remark-plugins/post-reading-time.mjs';
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://isaaccorbrey.com',
	integrations: [svelte(), mdx()],
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
		],
		shikiConfig: {
			wrap: true,
		}
	}
});
