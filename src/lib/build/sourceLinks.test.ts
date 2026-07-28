import { describe, expect, it } from 'vitest';
import { rehypeSourceLinks } from './sourceLinks.js';

type TextNode = {
	type: 'text';
	value: string;
};

type ElementNode = {
	type: 'element';
	tagName: string;
	properties: Record<string, string>;
	children: Array<ElementNode | TextNode>;
};

type RootNode = {
	type: 'root';
	children: ElementNode[];
};

describe('source links', () => {
	it('opens monospace Quote Slicer GitHub source links in a new tab', () => {
		const tree = root([
			link('https://github.com/ebbmango/quote-slicer/blob/main/src/routes/%2Bpage.svelte', [
				code('+page.svelte')
			])
		]);

		rehypeSourceLinks()(tree);

		expect(tree.children[0].properties).toEqual({
			href: 'https://github.com/ebbmango/quote-slicer/blob/main/src/routes/%2Bpage.svelte',
			target: '_blank',
			rel: 'noopener noreferrer'
		});
	});

	it('leaves internal docs links and non-code external links alone', () => {
		const tree = root([
			link('/components/layout', [code('Layout.svelte')]),
			link('https://github.com/ebbmango/quote-slicer/blob/main/src/routes/%2Bpage.svelte', [
				text('+page.svelte')
			])
		]);

		rehypeSourceLinks()(tree);

		expect(tree.children[0].properties).toEqual({ href: '/components/layout' });
		expect(tree.children[1].properties).toEqual({
			href: 'https://github.com/ebbmango/quote-slicer/blob/main/src/routes/%2Bpage.svelte'
		});
	});
});

function root(children: ElementNode[]): RootNode {
	return {
		type: 'root',
		children
	};
}

function link(href: string, children: Array<ElementNode | TextNode>): ElementNode {
	return {
		type: 'element',
		tagName: 'a',
		properties: { href },
		children
	};
}

function code(value: string): ElementNode {
	return {
		type: 'element',
		tagName: 'code',
		properties: {},
		children: [text(value)]
	};
}

function text(value: string): TextNode {
	return {
		type: 'text',
		value
	};
}
