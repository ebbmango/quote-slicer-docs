<script lang="ts">
	import { resolve } from '$app/paths';
	import SidebarSpacer from '../components/Menu/SidebarSpacer.svelte';
</script>

<main class="flex min-w-0 flex-1 flex-col items-center">
	<article
		class="prose prose-xl w-full min-w-0 px-8 pt-7 pb-[10dvh] font-inter font-light dark:prose-invert prose-headings:font-dm-serif prose-headings:font-light prose-headings:tracking-normal prose-h1:normal-case prose-code:font-mono prose-pre:font-mono"
	>
		<h1>Quote Slicer Docs</h1>

		<p>
			[Project V] is a Chinese character learning and dictionary app, built around deep Hanzi
			study — dictionary entries, lessons, flashcards, etymology, historical forms,
			handwriting, and quote-based reading, all in one place.
		</p>

		<p>
			<strong>Quote Slicer</strong> is the first of two accessory apps that feed [Project V].
			It processes Chinese quotes and texts, segmenting them and linking words and phrases to
			their translations, so [Project V] can display interactive, annotated reading passages.
		</p>

		<p>
			These docs cover Quote Slicer itself — its interaction modes, components, and the
			tokenization pipeline behind the data it produces.
		</p>

		<p>
			<a href={resolve('/overview')}>Start with the Overview &rarr;</a>
		</p>
	</article>
</main>

<SidebarSpacer />
