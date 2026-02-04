export type Theme = {
	dark: boolean;
};

export type LayoutMode = 'none' | 'mini' | 'half' | 'full';

export type Layout = {
	mode: LayoutMode;
	mainWidth: number;
	sideWidth: number;
};

export type Viewport = {
	width: number;
};
