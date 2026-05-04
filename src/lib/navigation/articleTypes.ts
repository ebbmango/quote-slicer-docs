import type { Pathname } from '$app/types';

export type NavigationPath = Pathname;

export type NavigationNodeKind = 'article' | 'section';

export type Article = {
	kind: 'article';
	title: string;
	path: NavigationPath;
	accentIndex: number;
};

export type Section = {
	kind: 'section';
	title: string;
	accentIndex: number;
	children: Article[];
};

export type NavigationNode = Article | Section;

export type NavigationTree = NavigationNode[];

export function isSection(item: NavigationNode): item is Section {
	return item.kind === 'section';
}

export function isArticle(item: NavigationNode): item is Article {
	return item.kind === 'article';
}
