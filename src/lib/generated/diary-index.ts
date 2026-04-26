export type DiaryIndexEntry = {
	slug: string;
	path: string;
	contentPath: string;
	title: string;
	date: string;
	timestamp: number;
	summary: string;
	tags: string[];
	searchText: string;
};

export const diaryEntries: DiaryIndexEntry[] = [
	{
		"slug": "reactive-theme",
		"path": "/development-diary/reactive-theme",
		"contentPath": "/src/content/diary/reactive-theme.svx",
		"title": "Reactive Theme",
		"date": "2026-04-26",
		"timestamp": 1777161600000,
		"summary": "How the documentation site theme reacts to OS and user changes without losing synchronization across tabs.",
		"tags": [
			"theme",
			"svelte",
			"architecture"
		],
		"searchText": "reactive theme how the documentation site theme reacts to os and user changes without losing synchronization across tabs. reactive-theme theme svelte architecture"
	}
];
