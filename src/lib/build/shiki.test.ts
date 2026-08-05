import { describe, expect, it } from 'vitest';
import config from '../../../svelte.config.js';

describe('Shiki highlighting', () => {
	it('keeps comment colours identical across themes', async () => {
		const preprocessors = Array.isArray(config.preprocess)
			? config.preprocess
			: config.preprocess
				? [config.preprocess]
				: [];
		const mdsvex = preprocessors.find((preprocessor) => preprocessor.name === 'mdsvex');
		if (!mdsvex?.markup) throw new Error('Missing MDsveX preprocessor');

		const result = await mdsvex.markup({
			content: '```js\n// comment\n```',
			filename: 'comment-colour.svx'
		});
		const commentStyle = result?.code.match(/--shiki-light:(#[\da-f]+);--shiki-dark:(#[\da-f]+)/i);

		expect(commentStyle?.slice(1).map((colour) => colour.toLowerCase())).toEqual([
			'#7b7f8b',
			'#7b7f8b'
		]);
	});
});
