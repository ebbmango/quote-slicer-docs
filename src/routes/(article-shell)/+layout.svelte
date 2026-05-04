<script lang="ts">
	import Sidebar from '../../components/Sidebar.svelte';

	let { children, data } = $props();
</script>

<!-- todo: keep scrollbar if content sidebar doesn't exist -->
<main class="flex h-full min-h-0 min-w-0 flex-1 flex-col items-center">
	<article
		class="prose-transition hidebar prose prose-xl h-full w-full min-w-0 overflow-scroll scroll-smooth px-8 pt-7 pb-[10dvh] font-inter font-light dark:prose-invert prose-headings:font-dm-serif prose-headings:font-light prose-headings:tracking-normal prose-h1:normal-case prose-code:font-mono prose-pre:font-mono"
	>
		{@render children()}
	</article>
</main>

<!-- Sidebar: Contents -->

<Sidebar headings={data.toc} />

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
