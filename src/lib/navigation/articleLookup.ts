import type { RouteId } from '$app/types';
import type { Article, RootArticle } from './articleTypes';
import { isSection } from './articleTypes';
import { articleTree } from './articleTree';

const routeGroupPattern = /\/\([^/]+\)(?=\/|$)/g;

/*
	Route IDs are SvelteKit's file-system route identities, e.g.
	/(article-shell)/(docs)/(01)/overview or
	/(article-shell)/(diary)/development-diary/[slug].

	Article paths are this app's navigation identities, e.g. 
	/overview or /development-diary.

	They differ because the route tree uses groups for layouts, docs/diary
	organization, and ordering folders, while the sidebar/article tree needs
	clean navigation keys. Diary entry routes are also collapsed to the single
	Development Diary nav item.
*/

export const diaryNavItem: Article = {
	kind: 'article',
	title: 'Development Diary',
	path: '/development-diary',
	...getDiaryIndexes()
};

const articleDirectory = new Map<string, Article>();

for (const item of articleTree) {
	if (isSection(item)) {
		for (const article of item.children) {
			articleDirectory.set(article.path, article);
		}
		continue;
	}

	articleDirectory.set(item.path, item);
}

export function findArticleByPath(path: string): Article | undefined {
	return (
		articleDirectory.get(path) ??
		(path === diaryNavItem.path || path.startsWith(`${diaryNavItem.path}/`)
			? diaryNavItem
			: undefined)
	);
}

function routeIdToArticlePath(routeId: RouteId): string {
	return routeId.replace(routeGroupPattern, '') || '/';
}

export function findArticleByRouteId(routeId: RouteId | null): Article | undefined {
	if (!routeId) return undefined;

	return findArticleByPath(routeIdToArticlePath(routeId));
}

function getDiaryIndexes(): Pick<RootArticle, 'nodeIndex' | 'groupIndex' | 'nestedIndex'> {
	let nodeIndex = 0;
	let groupIndex = 0;

	for (const item of articleTree) {
		nodeIndex += 1;

		if (isSection(item)) {
			nodeIndex += item.children.length;
			continue;
		}

		groupIndex += 1;
	}

	return { nodeIndex, groupIndex, nestedIndex: null };
}
