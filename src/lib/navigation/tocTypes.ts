export type TocHeading = {
	title: string;
	id: string;
	level: number;
	position: number;
	children: TocHeading[];
};

export type TocTree = TocHeading[];

export type TocByRoute = Record<string, TocTree>;
