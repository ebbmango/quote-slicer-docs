<script lang="ts">
	import { getContext } from 'svelte';
	import pickColor from '../utils/pickColor';
	import type { Theme } from '$lib/types';

	const { slug, title, index } = $props();

	const theme: Theme = getContext('theme');
	const color = pickColor(index, theme);

	let hover: boolean = $state(false);
</script>

<a
	href={slug}
	onmouseenter={() => (hover = true)}
	onmouseleave={() => (hover = false)}
	style="color: {hover && color}"
	class="w-full duration-200 hover:ps-1"
>
	{title}
</a>
