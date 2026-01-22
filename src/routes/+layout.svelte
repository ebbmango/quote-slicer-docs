<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import Menubar from '../components/Menubar.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import type { Theme, Width } from '$lib/types';

	let { children } = $props();

	let theme: Theme = $state({ dark: false });
	setContext('theme', theme);
	let width: Width = $state({ current: 0 });
	setContext('width', width);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth={width.current} />
{#if width.current > 0}
	{#if width.current <= 700}
		<Menubar />
	{/if}
	<div class="flex h-dvh w-full" class:dark={theme.dark}>
		<!-- sidebar --- docs - topics -->
		{#if width.current > 700}
			<Sidebar />
		{/if}
		<main class="flex w-full flex-col items-center duration-300 dark:bg-umbra">
			<article class="prose h-full w-full px-8 py-7 duration-300 dark:prose-invert">
				{@render children()}
			</article>
		</main>
		<!-- sidebar --- page chapters (contents) -->
		{#if width.current >= 1220}
			<div class="contents-sidebar h-vh bg-gray-50 dark:bg-noctis"></div>
		{/if}
	</div>
{/if}

<!-- sidebar: it should preserve its normal size (min-w-70) until the screen reaches 800px width -->
<!-- it should somehow squeeze (margins and paddings included) up to min-w-60 until the screen -->
<!-- reaches a min. of 700px; then it should disappear completely, and be toggleable by a button -->
<!-- on the horizontal navbar attached to the top, but as an overlay; the design must be reworked then -->

<!-- contents: 1300px+ > should have min-w-70 (280px). -->
<!-- smaller than that: it should shrink until it reaches its min. at min-w-60 (240px) at 1220px -->
<!-- smaller than that: it should disappear completely, and be toggleable by a discrete button on -->
<!-- the right-hand side of the screen, but as an overlay -->
<style>
	.contents-sidebar {
		width: clamp(240px, calc(50vw - 370px), 280px);
		min-width: clamp(240px, calc(50vw - 370px), 280px);
		flex: 0 0 auto;
	}
</style>
