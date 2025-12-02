<script lang="ts">
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types';
	import pickColor from '../utils/pickColor';

	let hover = $state(false);

	const { section, index } = $props();
	const theme: Theme = getContext('theme');
	let color = $derived(pickColor(index, theme));
</script>

<a
	href={section.slug}
	class="font-inter text-[14px] font-medium duration-300 hover:ms-2"
	onmouseenter={() => (hover = true)}
	onmouseleave={() => (hover = false)}
	style:color={hover ? color : undefined}
>
	{section.title.toUpperCase()}
</a>
