import { describe, expect, it } from 'vitest';
import {
	extractTocFromSvx,
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
