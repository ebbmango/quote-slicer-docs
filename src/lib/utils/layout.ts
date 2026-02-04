import type { Layout, LayoutMode } from '$lib/types';

export function getMode(screenWidth: number): LayoutMode {
	if (screenWidth > 1200) return 'full';
	if (screenWidth > 700) return 'half';
	return 'mini';
}

export function scaleMain(screenWidth: number): number {
	if (screenWidth > 1200) return Math.max(240, Math.min(280, screenWidth * 0.2));
	if (screenWidth >= 800) return Math.max(240, Math.min(280, screenWidth * 0.3));
	return 0;
}

export function scaleSide(screenWidth: number): number {
	if (screenWidth > 1200) return Math.max(240, Math.min(280, screenWidth * 0.2));
	return 0;
}

export function deriveLayout(screenWidth: number): Layout {
	return {
		mode: getMode(screenWidth),
		mainWidth: scaleMain(screenWidth),
		sideWidth: scaleSide(screenWidth)
	};
}
