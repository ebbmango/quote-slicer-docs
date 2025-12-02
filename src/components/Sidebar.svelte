<script lang="ts">
	import { docsStructure } from '$lib/constants/docs-structure';
	import Fa from 'svelte-fa';
	import Dropdown from './Dropdown.svelte';
	import Navlink from './Navlink.svelte';
	import { faSquareQuote } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import { colors } from '$lib/constants/colors';

	const sections = docsStructure;
</script>

<div
	class="flex h-dvh min-w-70 flex-col items-center justify-between overflow-hidden border-0 border-r border-gray-200 px-8 duration-300 dark:border-[#404040] dark:bg-umbra dark:text-gray-300"
>
	<!-- Logo -->
	<div class="flex min-h-30 items-center justify-center gap-2">
		<Fa class="text-6xl" icon={faSquareQuote}></Fa>
		<div class="flex flex-col">
			<span>Quote Slicer</span>
			<span>Docs</span>
		</div>
	</div>
	<!-- Navlinks -->
	<div class="hide-bar relative w-full overflow-scroll">
		<div class="hide-bar flex h-full w-full flex-col gap-8 overflow-scroll pb-12">
			{#each sections as section, i}
				{#if section.children}
					<Dropdown {section} index={i} />
				{:else}
					<Navlink {section} index={i} />
				{/if}
			{/each}
		</div>
	</div>
	<!-- Dark/Light Toggle -->
	<div class="relative flex h-20 w-full justify-center">
		<DarkModeToggle />
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.hide-bar::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.hide-bar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
