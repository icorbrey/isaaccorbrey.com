/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			display: ['"Afacad Flux"', 'sans-serif'],
			code: ['"FiraCode Nerd Font"', '"Fira Code"', 'monospace'],
		},
		extend: {
			colors: {
				bg: {
					1: "#1e1e1e",
					2: "#282828",
					3: "#ffffff1c",
				},
				fg: {
					1: "#dcdcdc",
					2: "#bfbfbf",
					3: "#8c8c8c",
					4: "#686868",
				},
				ui: {
					1: "#373737",
					2: "#515151",
					3: "#595959",
				},
				red: {
					400: "#ff3b11",
				},
				orange: {
					400: "#ff9502",
					500: "#e68600",
				},
				yellow: {
					400: "#ffcc00",
				},
				green: {
					400: "#2acd41",
				},
				cyan: {
					400: "#02c7be",
				},
				blue: {
					300: "#1a85ff",
					400: "#027aff",
					500: "#0065d9",
					600: "#0056b8",
				},
				purple: {
					400: "#b051de",
				},
				pink: {
					400: "#ff2e55",
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		function ({ addVariant }) {
			addVariant(
				"prose-inline-code",
				'&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
			);
		},
	],
}
