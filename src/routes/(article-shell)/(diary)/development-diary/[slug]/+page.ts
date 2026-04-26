import { error } from '@sveltejs/kit';
import { diaryEntries } from '$lib/generated/diary-index';

export const prerender = true;

export function entries() {
	return diaryEntries.map(({ slug }) => ({ slug }));
}

export function load({ params }) {
	const entry = diaryEntries.find(({ slug }) => slug === params.slug);

	if (!entry) {
		throw error(404, 'Diary entry not found');
	}

	return {
		entry,
		contentPath: entry.contentPath
	};
}
