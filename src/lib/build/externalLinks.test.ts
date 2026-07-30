import { compile } from 'mdsvex';
import { describe, expect, it } from 'vitest';
import { rehypeExternalLinks } from './externalLinks.js';

describe('external links', () => {
	it('opens external Markdown links in a new tab and leaves other links alone', async () => {
		const markdown =
			'[external](https://svelte.dev/docs/svelte/if) [protocol](//example.com/docs) [`source`](https://github.com/ebbmango/quote-slicer/blob/main/src/lib/context/breakpoints.svelte.ts) [article](/overview) [email](mailto:hello@example.com)';
		const result = await compile(markdown, { rehypePlugins: [rehypeExternalLinks] });

		expect(String(result?.code).trim()).toBe(`<p><a
  href="https://svelte.dev/docs/svelte/if"
  rel="noopener noreferrer"
  target="_blank"
>external</a> <a href="//example.com/docs" target="_blank" rel="noopener noreferrer">protocol</a> <a
  href="https://github.com/ebbmango/quote-slicer/blob/main/src/lib/context/breakpoints.svelte.ts"
  rel="noopener noreferrer"
  target="_blank"
><code>source</code></a> <a href="/overview">article</a> <a href="mailto:hello@example.com">email</a></p>`);
	});
});
