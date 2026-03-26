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

const routeFolders = /\(\d{2}\)\//g;
const articlePaths = import.meta.glob('/src/routes/**/+page.svx', { eager: true });

const websitePaths = Object.entries(articlePaths).map((path) =>
	path[0].slice(17, -10).replace(routeFolders, '')
);

export const worldTree = buildWorldTree(websitePaths);

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
