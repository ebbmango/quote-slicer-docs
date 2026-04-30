<script lang="ts">
	import type { Component } from 'svelte';

	let { data } = $props();

	const diaryModules = import.meta.glob<Component>('/src/content/diary/*.svx', {
		eager: true, // important for no-js users
		import: 'default'
	});

	let Article = $derived.by(() => {
		const article = diaryModules[data.contentPath];

		if (!article) {
			throw new Error(`Missing diary module for ${data.contentPath}`);
		}

		return article;
	});
</script>

<svelte:head>
	<title>{data.entry.title} | Development Diary</title>
</svelte:head>

<Article />
