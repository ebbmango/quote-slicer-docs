<script lang="ts">
	import { getContext } from 'svelte';
	import type { Layout, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import Sidebar from '../../components/Sidebar.svelte';

	let { children } = $props();
	const viewport = getContext<Viewport>('viewport');
	const layout = getContext<Layout>('layout');
	const { artWidth } = getContext<{ artWidth: Spring<number> }>('layoutMotion');

	let showChapters = $derived(viewport.width >= 1220 || artWidth.current > 0);
</script>

<!-- todo: keep scrollbar if content sidebar doesn't exist -->
<main class="ui-surface-transition flex w-full flex-col items-center bg-white dark:bg-umbra">
	<!-- add this once you fix the weird placement -->
	<!-- class:hidebar={showChapters} -->
	<article
		class="prose-transition hidebar prose h-dvh w-full overflow-scroll px-8 py-7 font-garamond text-xl dark:prose-invert"
	>
		{@render children()}
	</article>
</main>

<!-- Sidebar: Contents -->
{#if showChapters}
	<Sidebar width={artWidth.current} />
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
