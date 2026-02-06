<script lang="ts">
	import { docsStructure } from '$lib/constants/docs-structure';
	import Fa from 'svelte-fa';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import Dropdown from './Dropdown.svelte';
	import Navlink from './Navlink.svelte';
	import { faSquareQuote } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import Logo from './Logo.svelte';
	import { resolve } from 'path';

	type Props = { width: number };

	let { width }: Props = $props();

	const sections = docsStructure;
</script>

<nav
	class="colors-transition h-vh relative flex w-70 flex-col justify-center overflow-hidden bg-gray-50 dark:bg-noctis dark:text-gray-300"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto; overflow: hidden;"
>
	<a href={resolve('/')} class="absolute top-0 mt-6 flex w-full justify-center">
		<Logo />
	</a>

	<div class="hide-bar relative mt-16 w-full -translate-y-8 overflow-scroll px-7 py-24">
		<div
			class="hide-bar flex h-full w-full flex-col gap-8 overflow-scroll overflow-x-hidden text-nowrap"
		>
			{#each sections as section, i}
				{#if section.children}
					<Dropdown {section} index={i} />
				{:else}
					<Navlink {section} index={i} />
				{/if}
			{/each}
		</div>
	</div>

	<div class="absolute bottom-0 flex h-20 w-full justify-center">
		<DarkModeToggle />
	</div>
</nav>

<style>
	.colors-transition {
		transition:
			color 300ms,
			background-color 300ms;
	}
</style>
