import { colors } from '$lib/constants/colors';
import type { Theme } from '$lib/types';

export default function pickColor(index: number, theme: Theme): string {
	const color = colors[index % colors.length];
	return theme.dark ? color.dark : color.light;
}
