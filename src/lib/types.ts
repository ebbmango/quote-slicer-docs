export type ThemeName = 'dark' | 'light';

export interface Theme {
	current: ThemeName; // yes, this is correct even if implemented via get/set
}

export type LayoutVariant = 'none' | 'mini' | 'half' | 'full';

export type Layout = {
	variant: LayoutVariant;
	// The computed values for the widths:
	webWidth: number; // of the website navbar
	artWidth: number; // of the article navbar
};

export type Viewport = {
	width: number;
};
