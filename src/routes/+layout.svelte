<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setContext, onMount } from 'svelte';
	import type { Layout, Theme, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import { deriveLayout, scaleMain, scaleSide } from '$lib/utils/layout';

	let { children } = $props();

	let theme: Theme = $state({ dark: false });
	setContext('theme', theme);

	let viewport: Viewport = $state({ width: 0 });
	setContext('viewport', viewport);

	let computedLayout = $derived(deriveLayout(viewport.width));

	const layout: Layout = {
		get mode() {
			return computedLayout.mode;
		},
		get mainWidth() {
			return computedLayout.mainWidth;
		},
		get sideWidth() {
			return computedLayout.sideWidth;
		}
	};

	setContext('layout', layout);

	let mainWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });
	let sideWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });

	onMount(() => {
		// Set initial values without animation
		mainWidth.set(scaleMain(viewport.width), { instant: true });
		sideWidth.set(scaleSide(viewport.width), { instant: true });
	});

	$effect(() => {
		// Only animate after mount
		mainWidth.target = layout.mainWidth;
		sideWidth.target = layout.sideWidth;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth={viewport.width} />
{#if viewport.width > 0}
	<div class="flex h-dvh w-full" class:dark={theme.dark}>
		<!-- Mainbar: Navigation -->
		{#if viewport.width > 700 || mainWidth.current > 0}
			<nav
				class="h-vh flex w-70 flex-col items-center justify-between overflow-hidden bg-gray-50 dark:bg-noctis dark:text-gray-300"
				style="width: {mainWidth.current}px; min-width: {mainWidth.current}px; flex: 0 0 auto; overflow: hidden;"
			></nav>
		{/if}
		<main class="flex w-full flex-col items-center duration-300 dark:bg-umbra">
			<article class="prose h-full w-full px-8 py-7 duration-300 dark:prose-invert">
				{@render children()}
			</article>
		</main>
		<!-- Sidebar: Contents -->
		{#if viewport.width >= 1220 || sideWidth.current > 0}
			<aside
				class="contents-sidebar h-vh bg-gray-50 dark:bg-noctis"
				style="width: {sideWidth.current}px; min-width: {sideWidth.current}px; flex: 0 0 auto; overflow: hidden;"
			></aside>
		{/if}
	</div>
{/if}

<style>
</style>
