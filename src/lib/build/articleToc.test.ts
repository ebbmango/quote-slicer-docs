import { describe, expect, it } from 'vitest';
import {
	extractTocFromSvx,
	rehypeHeadingIds,
	routeIdFromRouteFile,
	routePathFromRouteId,
	slugHeading
} from './articleToc.js';

describe('article ToC extraction', () => {
	it('builds a nested h2-h4 tree with stable duplicate ids', () => {
		expect.assertions(1);

		expect(
			extractTocFromSvx(`
---
title: Example
---

# {title}

## Overview

### Details

#### Details

## Overview
`)
		).toEqual([
			{
				title: 'Overview',
				id: 'overview',
				level: 2,
				position: 0,
				children: [
					{
						title: 'Details',
						id: 'details',
						level: 3,
						position: 1,
						children: [
							{
								title: 'Details',
								id: 'details-1',
								level: 4,
								position: 2,
								children: []
							}
						]
					}
				]
			},
			{
				title: 'Overview',
				id: 'overview-1',
				level: 2,
				position: 3,
				children: []
			}
		]);
	});

	it('ignores frontmatter, comments, svelte blocks, fenced code, h1, and h5+', () => {
		expect.assertions(1);

		expect(
			extractTocFromSvx(`
---
title: Ignored
---

<!--
## Ignored Comment
-->

<script>
## Ignored Script
</script>

# Ignored H1

\`\`\`md
## Ignored Code
\`\`\`

## Included

##### Ignored H5
`)
		).toEqual([
			{
				title: 'Included',
				id: 'included',
				level: 2,
				position: 0,
				children: []
			}
		]);
	});

	it('normalizes markdown-ish heading text before slugging', () => {
		expect.assertions(2);

		expect(slugHeading('Theme Initialization')).toBe('theme-initialization');
		expect(extractTocFromSvx('## `Code` and [Links](https://example.com) {#manual-id}')).toEqual([
			{
				title: 'Code and Links',
				id: 'code-and-links',
				level: 2,
				position: 0,
				children: []
			}
		]);
	});
});

describe('article heading ids', () => {
	it('adds ids to every static h1-h6 heading by default', () => {
		expect.assertions(1);

		const tree = {
			type: 'root',
			children: [
				heading('h1', 'Page Title'),
				heading('h2', 'Overview'),
				heading('h3', 'Overview'),
				heading('h4', 'Details'),
				heading('h5', 'Minor Detail'),
				heading('h6', 'Implementation Step'),
				{ type: 'element', tagName: 'p', children: [{ type: 'text', value: 'Body text' }] }
			]
		};

		rehypeHeadingIds()(tree);

		expect(tree.children.map((node) => nodeId(node))).toEqual([
			'page-title',
			'overview',
			'overview-1',
			'details',
			'minor-detail',
			'implementation-step',
			undefined
		]);
	});
});

function heading(tagName: string, value: string) {
	return {
		type: 'element',
		tagName,
		children: [{ type: 'text', value }]
	};
}

function nodeId(node: unknown) {
	return (node as { properties?: { id?: string } }).properties?.id;
}

describe('article route normalization', () => {
	it('maps grouped +page.svx files to SvelteKit route ids and URL paths', () => {
		expect.assertions(2);

		const routeId = routeIdFromRouteFile(
			'/repo/src/routes/(article-shell)/(docs)/(04)/functionalities/(02)/quote-tokenization/+page.svx',
			'/repo'
		);

		expect(routeId).toBe('/(article-shell)/(docs)/(04)/functionalities/(02)/quote-tokenization');
		expect(routePathFromRouteId(routeId)).toBe('/functionalities/quote-tokenization');
	});
});
