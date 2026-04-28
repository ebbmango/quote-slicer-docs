import { escapeSvelte, mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { codeToHtml } from 'shiki';

const dev = process.argv.includes('dev');

// good ones: kanagawa-wave, catppuccin-frappe

const shikiOptions = {
	themes: {
		light: 'dracula-soft',
		dark: 'dracula'
	},
	defaultColor: false,
	rootStyle: false,
	colorReplacements: {
		'dracula-soft': {
			'#62e884': '#8ae1b2', // lush
			'#f286c4': '#df9de1', // sugar
			'#e7ee98': '#f3df8d' // beeswax
		},
		dracula: {
			'#50fa7b': '#8ae1b2',
			'#ff79c6': '#df9de1',
			'#f1fa8c': '#f3df8d'
		}

		// laserwave: {
		// 	// $effect()
		// 	'#eb64b9': 'var(--maple-verse-back)',
		// 	// typeof
		// 	'#74dfc4': '#a1f4c7',
		// 	// if/return
		// 	'#40b4c4': '#df9de1',
		// 	// const
		// 	'#a96bc0': '#c1a2e7',
		// 	'#ffe261': 'var(--beeswax-verse-back)',
		// 	'#b4dce7': '#b3ecf2'
		// '#569cd6': '#b3bdf2',
		// '#9cdcfe': '#b3ecf2',
		// '#ce9178': 'var(--maple-verse-back)',
		// '#dcdcaa': 'var(--beeswax-verse-back)',
		// '#c586c0': 'var(--sugar-verse-back)'
		// }
		// 'github-light': {
		// 	'#6f42c1': 'var(--code-function-light)',
		// 	'#032f62': 'var(--code-string-light)'
		// },
		// 'github-dark-dimmed': {
		// 	'#dcbdfb': 'var(--code-function-dark)',
		// 	'#96d0ff': 'var(--code-string-dark)'
		// }
	}
};

async function highlightCode(code, lang) {
	const language = lang?.trim() || 'text';

	try {
		const html = await codeToHtml(code, { ...shikiOptions, lang: language });
		return `{@html \`${escapeSvelte(html)}\`}`;
	} catch (error) {
		if (language === 'text') throw error;

		const html = await codeToHtml(code, { ...shikiOptions, lang: language });
		return `{@html \`${escapeSvelte(html)}\`}`;
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			highlight: {
				highlighter: highlightCode
			}
		})
	],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: dev ? '' : '/quote-slicer-docs'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
