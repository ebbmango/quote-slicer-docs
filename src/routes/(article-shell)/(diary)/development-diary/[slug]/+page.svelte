<script lang="ts">
	const diaryModules = import.meta.glob('/src/content/diary/*.svx');

	let { data } = $props();

	let diaryModule = $derived.by(() => {
		const loader = diaryModules[data.contentPath];

		if (!loader) {
			throw new Error(`Missing diary module for ${data.contentPath}`);
		}

		return loader();
	});
</script>

<svelte:head>
	<title>{data.entry.title} | Development Diary</title>
</svelte:head>

{#await diaryModule then module}
	{@const Article = module.default}
	<Article />
{/await}
