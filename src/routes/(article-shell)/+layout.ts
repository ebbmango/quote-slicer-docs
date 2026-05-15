import { base } from '$app/paths';
import { tocByRoute } from 'virtual:article-toc';
import { diaryEntries } from '$lib/generated/diary-index';
import type { LayoutLoad } from './$types';

export const prerender = true;

type ArticleMetadata = {
	title?: string;
	date?: string;
	lastUpdated?: string;
	summary?: string;
	tags?: string[];
};

type ArticleModule = {
	metadata?: Record<string, unknown>;
};

const articleModules = import.meta.glob('/src/routes/(article-shell)/**/+page.svx', {
	eager: true
}) as Record<string, ArticleModule>;

function removeBase(pathname: string) {
	if (!base) return pathname;
	if (!pathname.startsWith(base)) return pathname;

	return pathname.slice(base.length) || '/';
}

function stringField(value: unknown) {
	if (value instanceof Date && !Number.isNaN(value.valueOf())) {
		return value.toISOString().slice(0, 10);
	}

	const normalizedValue = typeof value === 'string' ? value.trim() : '';

	return normalizedValue || undefined;
}

function stringArrayField(value: unknown) {
	if (!Array.isArray(value)) return undefined;

	const values = value
		.map((item) => (typeof item === 'string' ? item.trim() : ''))
		.filter((item) => item.length > 0);

	return values.length > 0 ? values : undefined;
}

function normalizeMetadata(metadata: Record<string, unknown> | undefined): ArticleMetadata | null {
	if (!metadata) return null;

	const articleMetadata = {
		title: stringField(metadata.title),
		date: stringField(metadata.date),
		lastUpdated: stringField(metadata.lastUpdated),
		summary: stringField(metadata.summary),
		tags: stringArrayField(metadata.tags)
	};

	if (Object.values(articleMetadata).some(Boolean)) return articleMetadata;

	return null;
}

function docsMetadata(routeId: string | null) {
	if (!routeId) return null;

	return normalizeMetadata(articleModules[`/src/routes${routeId}/+page.svx`]?.metadata);
}

function diaryMetadata(slug: string | undefined): ArticleMetadata | null {
	const entry = diaryEntries.find((entry) => entry.slug === slug);
	if (!entry) return null;

	return {
		title: entry.title,
		date: entry.date,
		lastUpdated: entry.lastUpdated,
		summary: entry.summary,
		tags: entry.tags
	};
}

export const load: LayoutLoad = ({ params, route, url }) => {
	const pathname = removeBase(url.pathname);

	return {
		toc: (route.id && tocByRoute[route.id]) || tocByRoute[pathname] || [],
		articleMetadata: diaryMetadata(params.slug) ?? docsMetadata(route.id)
	};
};
