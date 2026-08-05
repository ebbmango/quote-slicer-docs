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
	<article class="article-presentation--longform article-presentation px-8 pt-7 pb-[10dvh]">
		{#if articleMetadataItems.length > 0 || articleMetadata?.tags?.length}
			<aside
				class="not-article-presentation mb-6 flex flex-nowrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs tracking-[0.18em] uppercase opacity-50"
				aria-label="Article metadata"
			>
				<span id="published" class="inline-flex items-center gap-2">
					<span>Published</span>
					<time datetime={articleMetadata?.date}>{articleMetadata?.date}</time>
				</span>
				<!-- TODO: keep layout / conditionally show tags / come up with solution -->
				<!-- {#if articleMetadata?.tags?.length}
					<span>{articleMetadata.tags.join(' / ')}</span>
				{/if} -->
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
	@media (max-width: 450px) {
		#published {
			display: none;
		}
		#updated :first-child {
			display: none;
		}
	}
</style>
