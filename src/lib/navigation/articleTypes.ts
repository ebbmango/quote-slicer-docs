import type { Pathname } from '$app/types';

export type NavigationPath = Pathname;

export type NavigationNodeKind = 'article' | 'section';

type ArticleBase = {
	kind: 'article';
	title: string;
	path: NavigationPath;
	nodeIndex: number;
	groupIndex: number;
};

export type RootArticle = ArticleBase & {
	nestedIndex: null;
};

export type NestedArticle = ArticleBase & {
	nestedIndex: number;
};

export type Article = RootArticle | NestedArticle;

export type Section = {
	kind: 'section';
	title: string;
	nodeIndex: number;
	children: NestedArticle[];
};

export type NavigationNode = Article | Section;

export type NavigationTree = NavigationNode[];

export function isSection(item: NavigationNode): item is Section {
	return item.kind === 'section';
}

export function isArticle(item: NavigationNode): item is Article {
	return item.kind === 'article';
}
