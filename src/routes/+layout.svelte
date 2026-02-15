<script lang="ts">
	import '../lib/styles/index.css'
	import favicon from '$lib/assets/favicon.svg';
	import { setContext, onMount } from 'svelte';
	import type { Layout, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import { deriveLayout, scaleMain, scaleSide } from '$lib/utils/layout';
	import Navbar from '../components/NavbarY.svelte';
	import { theme } from '$lib/theme';

	let { children } = $props();

	$effect(() => {
		if (typeof document === 'undefined') return;
		const isDark = theme.current === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
		document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
	});

	let viewport: Viewport = $state({ width: 0 });
	setContext('viewport', viewport);

	let computedLayout = $derived(deriveLayout(viewport.width));

	const layout: Layout = {
		get mode() {
			return computedLayout.mode;
		},
		get webWidth() {
			return computedLayout.webWidth;
		},
		get artWidth() {
			return computedLayout.artWidth;
		}
	};

	setContext('layout', layout);

	let webWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });
	let artWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });

	onMount(() => {
		// Set initial values without animation
		webWidth.set(scaleMain(viewport.width), { instant: true });
		artWidth.set(scaleSide(viewport.width), { instant: true });
	});

	$effect(() => {
		// Only animate after mount
		webWidth.target = layout.webWidth;
		artWidth.target = layout.artWidth;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth={viewport.width} />
{#if viewport.width > 0}
	<div class="flex h-dvh w-full">
		<!-- Mainbar: Navigation -->
		{#if viewport.width > 700 || webWidth.current > 0}
			<Navbar width={webWidth.current} />
		{/if}

		<main class="flex w-full flex-col items-center bg-white duration-300 dark:bg-umbra">
			<article class="prose h-full w-full px-8 py-7 duration-300 dark:prose-invert">
				{@render children()}
			</article>
		</main>

		<!-- Sidebar: Contents -->
		{#if viewport.width >= 1220 || artWidth.current > 0}
			<aside
				class="colors-transition contents-sidebar h-vh bg-gray-50 dark:bg-noctis"
				style="width: {artWidth.current}px; min-width: {artWidth.current}px; flex: 0 0 auto; overflow: hidden;"
			></aside>
		{/if}
	</div>
{/if}

<style>
	.colors-transition {
		transition:
			color 300ms,
			background-color 300ms;
	}
</style>
