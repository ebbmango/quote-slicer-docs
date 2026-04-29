export type Article = {
	title: string;
	path: string;
	accentIndex: number;
};

export type Section = {
	title: string;
	accentIndex: number;
	children: Article[];
};

export function isSection(item: Article | Section): item is Section {
	return 'children' in item;
}
