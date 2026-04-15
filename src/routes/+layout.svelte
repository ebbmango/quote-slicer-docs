<script lang="ts">
	import '../lib/styles/index.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setContext, onMount } from 'svelte';
	import type { Layout, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import { deriveLayout, scaleMain, scaleSide } from '$lib/utils/layout';
	import Navbar from '../components/NavbarY.svelte';
	import { theme } from '$lib/theme';
	import Sidebar from '../components/Sidebar.svelte';

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
		webWidth.set(scaleMain(boundedWidth), { instant: true });
		artWidth.set(scaleSide(boundedWidth), { instant: true });
	});

	$effect(() => {
		// Only animate after mount
		webWidth.target = layout.webWidth;
		artWidth.target = layout.artWidth;
	});

	let showChapters = $derived(viewport.width >= 1220 || artWidth.current > 0);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth={viewport.width} />
{#if viewport.width > 0}
	<div
		class="flex h-dvh w-full overflow-auto"
		style="min-width: {MIN_LAYOUT_WIDTH}px; min-height: {MIN_LAYOUT_HEIGHT}px;"
	>
		<!-- Mainbar: Navigation -->
		{#if viewport.width > 700 || webWidth.current > 0}
			<Navbar width={webWidth.current} />
		{/if}

		<!-- todo: keep scrollbar if content sidebar doesn't exist -->
		<main class="ui-surface-transition flex w-full flex-col items-center bg-white dark:bg-umbra">
			<!-- add this once you fix the weird placement -->
			<!-- class:hidebar={showChapters} -->
			<article
				class="prose-transition hidebar prose h-dvh w-full overflow-scroll px-8 py-7 dark:prose-invert"
			>
				{@render children()}
			</article>
		</main>

		<!-- Sidebar: Contents -->
		{#if showChapters}
			<Sidebar width={artWidth.current} />
		{/if}
	</div>
{/if}

<style>
	article {
		--toc-flash-duration: 500ms;
		--toc-flash-shift: 0.16rem;
		--toc-accent-duration: 520ms;
		--toc-flash-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}

	article :global(:is(h1, h2, h3, h4, h5, h6)) {
		scroll-margin-top: 1rem;
		transition: color var(--toc-accent-duration) var(--ui-transition-timing-function) !important;
	}

	article :global(.toc-target-flash) {
		animation: toc-target-flash var(--toc-flash-duration) var(--toc-flash-timing-function);
		transform-origin: left center;
	}

	article :global(.toc-target-accent) {
		color: var(--toc-flash-accent, inherit) !important;
	}

	@keyframes toc-target-flash {
		0% {
			transform: translateX(0);
		}
		45% {
			transform: translateX(var(--toc-flash-shift));
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
