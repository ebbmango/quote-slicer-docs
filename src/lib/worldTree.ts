export type Article = {
	title: string;
	path: string;
};

export type Section = {
	title: string;
	children: Article[];
};

export function isSection(item: Article | Section): item is Section {
	return 'children' in item;
}

function toDisplayName(kebab: string) {
	return kebab
		.split('-')
		.map((word) => word[0]?.toUpperCase() + word.slice(1))
		.join(' ');
}

const routeGroupPattern = /\([^/]+\)\//g;
const pageModules = import.meta.glob('/src/routes/**/+page.svx', { eager: true });
const articlePrefix = '/src/routes/';
const articleSuffix = '/+page.svx';

const websitePaths = Object.keys(pageModules)
	.filter((path) => path.includes('/(articles)/'))
	.sort()
	.map((path) => normalizeRoutePath(path));

export const worldTree = buildWorldTree(websitePaths);

function normalizeRoutePath(filePath: string) {
	return filePath
		.slice(articlePrefix.length, -articleSuffix.length)
		.replace(routeGroupPattern, '');
}

function buildWorldTree(appRoutes: string[]): (Article | Section)[] {
	const worldTree: (Article | Section)[] = [];

	for (let i = 0; i < appRoutes.length; i++) {
		//
		const segments = appRoutes[i].split('/');
		let articleName: string, sectionName: string;

		// If it is an article
		if (segments.length === 1) {
			articleName = segments[0];
			worldTree.push({ title: toDisplayName(articleName), path: '/' + articleName });
			continue;
		}

		// If it is a section
		sectionName = segments[0];
		const node: Section = { title: toDisplayName(sectionName), children: [] };

		let slughead = sectionName.length + 1;

		for (let j = i; j < appRoutes.length; j++) {
			const route = appRoutes[j];
			if (!route.startsWith(sectionName + '/')) break;
			articleName = appRoutes[j].slice(slughead);
			node.children.push({
				title: toDisplayName(articleName),
				path: '/' + sectionName + '/' + articleName
			});
			i = j;
		}

		worldTree.push(node);
	}

	return worldTree;
}
