import type { Pathname } from '$app/types';

export type NavigationPath = Pathname;

export type Article = {
	title: string;
	path: NavigationPath;
	accentIndex: number;
};

export type Section = {
	title: string;
	accentIndex: number;
	children: Article[];
};

export type NavigationNode = Article | Section;

export type NavigationTree = NavigationNode[];

export function isSection(item: NavigationNode): item is Section {
	return 'children' in item;
}
