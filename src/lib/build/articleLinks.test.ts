import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildArticleLinkCatalog, remarkArticleLinks, resolveArticleLink } from './articleLinks.js';

const roots: string[] = [];

afterEach(() => {
	for (const root of roots.splice(0)) {
		rmSync(root, { recursive: true, force: true });
	}
});

describe('article link resolution', () => {
	it('resolves same-article headings, other articles, and other article headings', () => {
		expect.assertions(4);

		const root = fixtureRoot();
		const catalog = buildArticleLinkCatalog(root);
		const currentArticle = catalog.articlesByPath.get('/overview');

		expect(
			resolveArticleLink(catalog, {
				currentArticle,
				target: '#Deep Dive',
				basePath: '/quote-slicer-docs'
			})
		).toEqual({
			href: '#deep-dive',
			label: 'Deep Dive'
		});

		expect(
			resolveArticleLink(catalog, {
				currentArticle,
				target: 'quote-tokenization',
				basePath: '/quote-slicer-docs'
			})
		).toEqual({
			href: '/quote-slicer-docs/functionalities/quote-tokenization',
			label: 'Quote Tokenization'
		});

		expect(
			resolveArticleLink(catalog, {
				currentArticle,
				target: 'quote-tokenization#Token Boundaries',
				basePath: '/quote-slicer-docs'
			})
		).toEqual({
			href: '/quote-slicer-docs/functionalities/quote-tokenization#token-boundaries',
			label: 'Token Boundaries'
		});

		expect(
			resolveArticleLink(catalog, {
				currentArticle,
				target: 'Reactive Theme#Follow OS',
				basePath: '/quote-slicer-docs'
			})
		).toEqual({
			href: '/quote-slicer-docs/development-diary/reactive-theme#follow-os',
			label: 'Follow OS'
		});
	});

	it('turns wiki links in mdsvex text into markdown links', () => {
		expect.assertions(2);

		const root = fixtureRoot();
		const messages: string[] = [];
		const tree = {
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: 'Read [' },
						linkReference('#Deep Dive|this section'),
						{ type: 'text', value: '], then [' },
						linkReference('quote-tokenization#Token Boundaries'),
						{ type: 'text', value: '].' }
					]
				}
			]
		};

		remarkArticleLinks({ root, basePath: '/quote-slicer-docs' })(tree, {
			filename: path.join(root, 'src/routes/(article-shell)/(docs)/(01)/overview/+page.svx'),
			message(message) {
				messages.push(message);
			}
		});

		expect(tree.children[0].children).toEqual([
			{ type: 'text', value: 'Read ' },
			{
				type: 'link',
				url: '#deep-dive',
				title: null,
				children: [{ type: 'text', value: 'this section' }]
			},
			{ type: 'text', value: ', then ' },
			{
				type: 'link',
				url: '/quote-slicer-docs/functionalities/quote-tokenization#token-boundaries',
				title: null,
				children: [{ type: 'text', value: 'Token Boundaries' }]
			},
			{ type: 'text', value: '.' }
		]);
		expect(messages).toEqual([]);
	});

	it('renders labeled unresolved links as plain text and records a warning', () => {
		expect.assertions(2);

		const root = fixtureRoot();
		const messages: string[] = [];
		const tree = {
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{ type: 'text', value: 'Read [' },
						linkReference('missing-article|later'),
						{ type: 'text', value: '].' }
					]
				}
			]
		};

		remarkArticleLinks({ root })(tree, {
			filename: path.join(root, 'src/routes/(article-shell)/(docs)/(01)/overview/+page.svx'),
			message(message) {
				messages.push(message);
			}
		});

		expect(tree.children[0].children).toEqual([
			{ type: 'text', value: 'Read ' },
			{ type: 'text', value: 'later' },
			{ type: 'text', value: '.' }
		]);
		expect(messages).toEqual(['Unresolved article link in /overview: [[missing-article]]']);
	});
});

function fixtureRoot() {
	const root = mkdtempSync(path.join(tmpdir(), 'quote-slicer-docs-'));
	roots.push(root);

	writeArticle(
		root,
		'src/routes/(article-shell)/(docs)/(01)/overview/+page.svx',
		`---
title: Overview
---

# Overview

## Deep Dive
`
	);
	writeArticle(
		root,
		'src/routes/(article-shell)/(docs)/(04)/functionalities/(02)/quote-tokenization/+page.svx',
		`---
title: Quote Tokenization
---

# Quote Tokenization

## Token Boundaries
`
	);
	writeArticle(
		root,
		'src/content/diary/reactive-theme.svx',
		`---
title: Reactive Theme
date: 2026-04-26
summary: Theme notes.
---

# Reactive Theme

###### Follow OS
`
	);

	return root;
}

function writeArticle(root: string, file: string, source: string) {
	const target = path.join(root, file);

	mkdirSync(path.dirname(target), { recursive: true });
	writeFileSync(target, source);
}

function linkReference(label: string) {
	return {
		type: 'linkReference',
		identifier: label.toLowerCase(),
		label,
		referenceType: 'shortcut',
		children: [{ type: 'text', value: label }]
	};
}
