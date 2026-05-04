import type { NavigationPath, NavigationTree, Section } from './articleTypes';

type RouteSegment = string;
type NormalizedArticleRoute = RouteSegment | `${RouteSegment}/${RouteSegment}`;
type ArticleRouteModulePath = `/src/routes/${string}/+page.svx`;

function toDisplayName(kebab: string): string {
	return kebab
		.split('-')
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(' ');
}

// i really gotta start commenting my code man

const routeGroupPattern = /\([^/]+\)\//g;
const pageModules = import.meta.glob('/src/routes/**/+page.svx', { eager: true }) as Record<
	ArticleRouteModulePath,
	unknown
>;
const articlePrefix = '/src/routes/';
const articleSuffix = '/+page.svx';

const websitePaths: NormalizedArticleRoute[] = (
	Object.keys(pageModules) as ArticleRouteModulePath[]
)
	.filter((path) => path.includes('/(article-shell)/(docs)/'))
	.sort()
	.map((path) => normalizeRoutePath(path));

export const articleTree: NavigationTree = buildArticleTree(websitePaths);

function normalizeRoutePath(filePath: ArticleRouteModulePath): NormalizedArticleRoute {
	return filePath
		.slice(articlePrefix.length, -articleSuffix.length)
		.replace(routeGroupPattern, '') as NormalizedArticleRoute;
}

function toNavigationPath(path: `/${string}`): NavigationPath {
	return path as NavigationPath;
}

function buildArticleTree(appRoutes: NormalizedArticleRoute[]): NavigationTree {
	const articleTree: NavigationTree = [];

	for (let i = 0; i < appRoutes.length; i++) {
		//
		const segments = appRoutes[i].split('/');
		const accentIndex = articleTree.length % 9;

		// If it is an article
		if (segments.length === 1) {
			const articleName = segments[0];
			articleTree.push({
				kind: 'article',
				title: toDisplayName(articleName),
				path: toNavigationPath(`/${articleName}`),
				accentIndex
			});
			continue;
		}

		// If it is a section
		const sectionName = segments[0];
		const node: Section = {
			kind: 'section',
			title: toDisplayName(sectionName),
			accentIndex,
			children: []
		};

		const slughead = sectionName.length + 1;

		for (let j = i; j < appRoutes.length; j++) {
			const route = appRoutes[j];
			if (!route.startsWith(sectionName + '/')) break;
			const articleName = appRoutes[j].slice(slughead);
			node.children.push({
				kind: 'article',
				title: toDisplayName(articleName),
				path: toNavigationPath(`/${sectionName}/${articleName}`),
				accentIndex: node.children.length % 9
			});
			i = j;
		}

		articleTree.push(node);
	}

	return articleTree;
}
