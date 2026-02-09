export type Mode = 'dark' | 'light';

export interface ThemeContext {
	current: Mode; // yes, this is correct even if implemented via get/set
}

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
