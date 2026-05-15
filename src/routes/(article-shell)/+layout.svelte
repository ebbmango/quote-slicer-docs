<script lang="ts">
	import Sidebar from '../../components/Menu/Sidebar.svelte';

	type ArticleMetadata = {
		date?: string;
		lastUpdated?: string;
		tags?: string[];
	};

	type MetadataItem = {
		label: string;
		value: string;
	};

	let { children, data } = $props();

	function metadataItems(metadata: ArticleMetadata | null | undefined): MetadataItem[] {
		if (!metadata) return [];

		return [
			metadata.date ? { label: 'Published', value: metadata.date } : null,
			metadata.lastUpdated ? { label: 'Updated', value: metadata.lastUpdated } : null
		].filter((item): item is MetadataItem => item !== null);
	}

	let articleMetadata = $derived(data.articleMetadata);
	let articleMetadataItems = $derived(metadataItems(articleMetadata));
</script>

<!-- todo: keep scrollbar if content sidebar doesn't exist -->
<main class="flex min-w-0 flex-1 flex-col items-center">
	<article
		class="prose-transition prose prose-xl w-full min-w-0 px-8 pt-7 pb-[10dvh] font-inter font-light dark:prose-invert prose-headings:font-dm-serif prose-headings:font-light prose-headings:tracking-normal prose-h1:normal-case prose-code:font-mono prose-pre:font-mono"
	>
		{#if articleMetadataItems.length > 0 || articleMetadata?.tags?.length}
			<aside
				class="not-prose mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs tracking-[0.18em] uppercase opacity-50"
				aria-label="Article metadata"
			>
				<span id="published" class="inline-flex items-center gap-2">
					<span>Published</span>
					<time datetime={articleMetadata?.date}>{articleMetadata?.date}</time>
				</span>

				<span id="updated" class="inline-flex items-center gap-2">
					<span>Updated</span>
					<time datetime={articleMetadata?.lastUpdated}>{articleMetadata?.lastUpdated}</time>
				</span>
			</aside>
		{/if}

		{@render children()}
	</article>
</main>

<!-- Sidebar: Contents -->

<Sidebar headings={data.toc} />

<style>
	article :global(:is(h1, h2, h3, h4, h5, h6)) {
		scroll-margin-top: 6.75rem;
	}

	@media (min-width: 800px) {
		article :global(:is(h1, h2, h3, h4, h5, h6)) {
			scroll-margin-top: 1rem;
		}
	}

	@media (max-width: 450px) {
		#published {
			display: none;
		}
		#updated :first-child {
			display: none;
		}
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

	article :global(a) {
		color: var(--article-link-color);
		font-style: italic;
		font-weight: inherit;
		text-decoration: none;
	}
</style>
