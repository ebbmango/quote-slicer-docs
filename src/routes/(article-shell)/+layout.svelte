<script lang="ts">
	import { getContext } from 'svelte';
	import type { Layout, Viewport } from '$lib/types';
	import { Spring } from 'svelte/motion';
	import Sidebar from '../../components/Sidebar.svelte';

	let { children } = $props();
</script>

<!-- todo: keep scrollbar if content sidebar doesn't exist -->
<main class="flex min-w-0 flex-1 flex-col items-center">
	<article
		class="prose-transition hidebar prose prose-xl h-dvh w-full min-w-0 overflow-scroll px-8 py-7 font-inter font-light dark:prose-invert prose-headings:font-dm-serif prose-headings:font-light prose-headings:tracking-normal prose-h1:normal-case prose-code:font-mono prose-pre:font-mono"
	>
		{@render children()}
	</article>
</main>

<!-- Sidebar: Contents -->

<Sidebar />

<style>
	article :global(:is(h1, h2, h3, h4, h5, h6)) {
		scroll-margin-top: 1rem;
	}

	article :global(h4) {
		font-size: 1.35em;
		line-height: 1.45;
	}

	article :global(h5) {
		font-size: 1.15em;
		line-height: 1.6;
	}

	article :global(h6) {
		font-size: 1em;
	}
</style>
