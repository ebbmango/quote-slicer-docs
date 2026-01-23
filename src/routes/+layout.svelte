<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setContext, onMount } from 'svelte';
	import type { Theme, Width } from '$lib/types';
	import { Spring } from 'svelte/motion';

	let { children } = $props();

	let theme: Theme = $state({ dark: false });
	setContext('theme', theme);
	let width: Width = $state({ current: 0 });
	setContext('width', width);

	function scaleMain(w: number): number {
		if (w > 1200) {
			return Math.max(240, Math.min(280, w * 0.2));
		} else if (w >= 800) {
			return Math.max(240, Math.min(280, w * 0.3));
		}
		return 0;
	}

	function scaleSide(w: number): number {
		if (w >= 1200) {
			return Math.max(240, Math.min(280, w * 0.2));
		}
		return 0;
	}

	let mainWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });
	let sideWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });

	onMount(() => {
		// Set initial values without animation
		mainWidth.set(scaleMain(width.current), { instant: true });
		sideWidth.set(scaleSide(width.current), { instant: true });
	});

	$effect(() => {
		// Only animate after mount
		mainWidth.target = scaleMain(width.current);
		sideWidth.target = scaleSide(width.current);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth={width.current} />
{#if width.current > 0}
	<div class="flex h-dvh w-full" class:dark={theme.dark}>
		<!-- Mainbar: Navigation -->
		{#if width.current > 700 || mainWidth.current > 0}
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
		{#if width.current >= 1220 || sideWidth.current > 0}
			<aside
				class="contents-sidebar h-vh bg-gray-50 dark:bg-noctis"
				style="width: {sideWidth.current}px; min-width: {sideWidth.current}px; flex: 0 0 auto; overflow: hidden;"
			></aside>
		{/if}
	</div>
{/if}

<style>
</style>
