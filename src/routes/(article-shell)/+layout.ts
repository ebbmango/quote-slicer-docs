import { base } from '$app/paths';
import { tocByRoute } from 'virtual:article-toc';
import type { LayoutLoad } from './$types';

export const prerender = true;

function removeBase(pathname: string) {
	if (!base) return pathname;
	if (!pathname.startsWith(base)) return pathname;

	return pathname.slice(base.length) || '/';
}

export const load: LayoutLoad = ({ route, url }) => {
	const pathname = removeBase(url.pathname);

	return {
		toc: (route.id && tocByRoute[route.id]) || tocByRoute[pathname] || []
	};
};
