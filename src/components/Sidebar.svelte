<script lang="ts">
	import { docsStructure } from '$lib/docs-structure';
	import Dropdown from './Dropdown.svelte';

	const sections = docsStructure;

	const colors = [
		'#aac834',
		'#67c492',
		'#88c8d7',
		'#8291df',
		'#b18ae1',
		'#d69bd8',
		'#d87d8f',
		'#e4a67c',
		'#d1b953'
	];
</script>

<div
	class="dark:border-gray- flex h-dvh min-w-70 flex-col gap-8 border-0 border-r border-gray-200 px-8 pt-8 dark:border-[#404040] dark:bg-umbra dark:text-gray-300"
>
	{#each sections as section, i}
		<Dropdown {section} color={colors[i % colors.length]} />
	{/each}
</div>
