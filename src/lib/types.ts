export type Theme = {
	dark: boolean;
};

export type LayoutMode = 'none' | 'mini' | 'half' | 'full';

export type Layout = {
	mode: LayoutMode;
	// The computed values for the widths:
	webWidth: number; // of the website navbar
	artWidth: number; // of the article navbar
};

export type Viewport = {
	width: number;
};
