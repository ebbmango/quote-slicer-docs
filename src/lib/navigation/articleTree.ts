import type { Article, Section } from './articleTypes';

function toDisplayName(kebab: string) {
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

const websitePaths = Object.keys(pageModules)
	.filter((path) => path.includes('/(article-shell)/(docs)/'))
	.sort()
	.map((path) => normalizeRoutePath(path));

export const articleTree = buildArticleTree(websitePaths);

function normalizeRoutePath(filePath: string) {
	return filePath.slice(articlePrefix.length, -articleSuffix.length).replace(routeGroupPattern, '');
}

function buildArticleTree(appRoutes: string[]): (Article | Section)[] {
	const articleTree: (Article | Section)[] = [];

	for (let i = 0; i < appRoutes.length; i++) {
		//
		const segments = appRoutes[i].split('/');
		let articleName: string, sectionName: string;
		const accentIndex = articleTree.length % 9;

		// If it is an article
		if (segments.length === 1) {
			articleName = segments[0];
			articleTree.push({
				title: toDisplayName(articleName),
				path: '/' + articleName,
				accentIndex
			});
			continue;
		}

		// If it is a section
		sectionName = segments[0];
		const node: Section = {
			title: toDisplayName(sectionName),
			accentIndex,
			children: []
		};

		let slughead = sectionName.length + 1;

		for (let j = i; j < appRoutes.length; j++) {
			const route = appRoutes[j];
			if (!route.startsWith(sectionName + '/')) break;
			articleName = appRoutes[j].slice(slughead);
			node.children.push({
				title: toDisplayName(articleName),
				path: '/' + sectionName + '/' + articleName,
				accentIndex: node.children.length % 9
			});
			i = j;
		}

		articleTree.push(node);
	}

	return articleTree;
}
