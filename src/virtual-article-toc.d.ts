declare module 'virtual:article-toc' {
	export type VirtualTocHeading = {
		title: string;
		id: string;
		level: number;
		position: number;
		children: VirtualTocHeading[];
	};

	export const tocByRoute: Record<string, VirtualTocHeading[]>;
}
