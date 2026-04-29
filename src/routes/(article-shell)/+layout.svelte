<script lang="ts">
	import { getContext } from 'svelte';
	import type { Layout, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import Sidebar from '../../components/Sidebar.svelte';

	let { children } = $props();
</script>

<!-- todo: keep scrollbar if content sidebar doesn't exist -->
<main class="ui-surface-transition flex w-full flex-col items-center">
	<!-- add this once you fix the weird placement -->
	<!-- class:hidebar={showChapters} -->
	<article
		class="prose-transition hidebar prose prose-xl h-dvh w-full overflow-scroll px-8 py-7 font-inter font-light dark:prose-invert prose-headings:font-dm-serif prose-headings:font-light prose-headings:tracking-normal prose-h1:normal-case prose-code:font-mono prose-pre:font-mono"
	>
		{@render children()}
	</article>
</main>

<!-- Sidebar: Contents -->

<Sidebar />

<style>
	article {
		--toc-flash-duration: 500ms;
		--toc-flash-shift: 0.16rem;
		--toc-flash-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}

	article :global(:is(h1, h2, h3, h4, h5, h6)) {
		scroll-margin-top: 1rem;
	}

	article :global(.toc-target-flash) {
		animation: toc-target-flash var(--toc-flash-duration) var(--toc-flash-timing-function);
		transform-origin: left center;
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
