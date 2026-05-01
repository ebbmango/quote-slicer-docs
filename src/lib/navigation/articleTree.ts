import type { NavigationPath, NavigationTree, Section } from './articleTypes';

function toDisplayName(kebab: string): string {
	return kebab
		.split('-')
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(' ');
}

// i really gotta start commenting my code man

const routeGroupPattern = /\([^/]+\)\//g;
const pageModules = import.meta.glob('/src/routes/**/+page.svx', { eager: true });
const articlePrefix = '/src/routes/';
const articleSuffix = '/+page.svx';

const websitePaths: string[] = Object.keys(pageModules)
	.filter((path) => path.includes('/(article-shell)/(docs)/'))
	.sort()
	.map((path) => normalizeRoutePath(path));

export const articleTree = buildArticleTree(websitePaths);

function normalizeRoutePath(filePath: string): string {
	return filePath.slice(articlePrefix.length, -articleSuffix.length).replace(routeGroupPattern, '');
}

function toNavigationPath(path: `/${string}`): NavigationPath {
	return path as NavigationPath;
}

function buildArticleTree(appRoutes: string[]): NavigationTree {
	const articleTree: NavigationTree = [];

	for (let i = 0; i < appRoutes.length; i++) {
		//
		const segments = appRoutes[i].split('/');
		const accentIndex = articleTree.length % 9;

		// If it is an article
		if (segments.length === 1) {
			const articleName = segments[0];
			articleTree.push({
				title: toDisplayName(articleName),
				path: toNavigationPath(`/${articleName}`),
				accentIndex
			});
			continue;
		}

		// If it is a section
		const sectionName = segments[0];
		const node: Section = {
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
