<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import { getContext } from 'svelte';
	import type { Theme } from '$lib/types';
	import pickColor from '../utils/pickColor';
	import DropdownLink from './DropdownLink.svelte';

	let hover = $state(false);
	let open = $state(false);
	let element: HTMLDivElement | null = $state(null);

	const { section, index } = $props();
	const theme: Theme = getContext('theme');
	let color = $derived(pickColor(index, theme));
</script>

<div>
	<button
		class="group flex w-full items-center justify-between font-inter text-[14px] font-medium"
		onmouseenter={() => (hover = true)}
		onmouseleave={() => (hover = false)}
		onclick={() => (open = !open)}
	>
		<span class="duration-300 group-hover:ms-2" style="color: {hover && color}">
			{section.title.toUpperCase()}
		</span>
		<Fa icon={faChevronDown} />
	</button>

	<div
		bind:this={element}
		class="ms-2 flex flex-col gap-2 overflow-hidden text-silver duration-400"
		style:height={open ? element.scrollHeight + 'px' : 0}
		class:mt-4={open}
	>
		{#each section.children as { slug, title }, index}
			<DropdownLink {slug} {title} {index} />
		{/each}
	</div>
</div>
