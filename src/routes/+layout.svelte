<script lang="ts">
	import '../lib/styles/index.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setContext, onMount } from 'svelte';
	import type { Layout, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import { deriveLayout, scaleMain, scaleSide } from '$lib/utils/layout';
	import Navbar from '../components/NavbarY.svelte';
	import { theme } from '$lib/theme';

	const MIN_LAYOUT_WIDTH = 320;
	const MIN_LAYOUT_HEIGHT = 455;

	let { children } = $props();

	$effect(() => {
		if (typeof document === 'undefined') return;
		const isDark = theme.current === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
		document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
	});

	let viewport: Viewport = $state({ width: 0 });
	setContext('viewport', viewport);

	let boundedWidth = $derived(Math.max(viewport.width, MIN_LAYOUT_WIDTH));
	let computedLayout = $derived(deriveLayout(boundedWidth));

	let webWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });
	let artWidth = new Spring(0, { stiffness: 0.05, damping: 0.7 });

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
	setContext('layoutMotion', { webWidth, artWidth });

	onMount(() => {
		// Set initial values without animation
		webWidth.set(scaleMain(boundedWidth), { instant: true });
		artWidth.set(scaleSide(boundedWidth), { instant: true });
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

<!-- The layout, at first, should be simple: just the navbar and the page's contents. -->
<!-- As the sidebar belongs only to article pages, it should comprise another layout. -->

{#if viewport.width > 0}
	<div
		class="flex h-dvh w-full"
		style="min-width: {MIN_LAYOUT_WIDTH}px; min-height: {MIN_LAYOUT_HEIGHT}px;"
	>
		<!-- Mainbar: Navigation -->
		{#if viewport.width > 700 || webWidth.current > 0}
			<Navbar width={webWidth.current} />
		{/if}

		{@render children()}
	</div>
{/if}
