<script lang="ts">
	import { resolve } from '$app/paths';
	import { diaryEntries } from '$lib/generated/diary-index';

	const INITIAL_VISIBLE = 20;

	let query = $state('');
	let visibleCount = $state(INITIAL_VISIBLE);

	let filteredEntries = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return diaryEntries;

		return diaryEntries.filter((entry) => entry.searchText.includes(normalizedQuery));
	});

	let visibleEntries = $derived(filteredEntries.slice(0, visibleCount));
	let hasMore = $derived(visibleCount < filteredEntries.length);

	function handleQuery(event: Event) {
		query = (event.currentTarget as HTMLInputElement).value;
		visibleCount = INITIAL_VISIBLE;
	}

	function revealMore() {
		visibleCount += INITIAL_VISIBLE;
	}
</script>

<svelte:head>
	<title>Development Diary</title>
</svelte:head>

<main class="hidebar h-dvh w-full overflow-y-auto bg-white px-8 py-8 dark:bg-umbra">
	<div class="mx-auto flex w-full max-w-4xl flex-col text-noctis dark:text-gray-100">
		<h1 class="text-2xl">Development Diary</h1>
		<p class="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
			Chronological notes about implementation details, design decisions, and experiments.
		</p>

		<div class="mt-8 flex flex-col gap-4">
			<label class="flex flex-col gap-2 text-sm">
				<span class="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
					Search Entries
				</span>
				<input
					type="search"
					value={query}
					oninput={handleQuery}
					placeholder="Search by title, summary, or tag"
					class="border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-(--acc) dark:border-gray-700 dark:bg-noctis dark:text-gray-100"
				/>
			</label>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
			</p>
		</div>

		{#if filteredEntries.length === 0}
			<p class="mt-10 text-base text-gray-600 dark:text-gray-300">
				No diary entries matched that search.
			</p>
		{:else}
			<ul class="mt-8 flex flex-col gap-6">
				{#each visibleEntries as entry}
					<li class="border-b border-gray-200 pb-6 dark:border-gray-800">
						<a href={resolve(entry.path)} class="block">
							<p class="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
								<time datetime={entry.date}>{entry.date}</time>
							</p>
							<h2 class="ui-link-transition mt-2 text-xl hover:text-(--acc)">
								{entry.title}
							</h2>
							<p class="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
								{entry.summary}
							</p>
							{#if entry.tags.length > 0}
								<p class="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
									{entry.tags.join(' • ')}
								</p>
							{/if}
						</a>
					</li>
				{/each}
			</ul>

			{#if hasMore}
				<div class="mt-8 flex justify-center">
					<button
						type="button"
						class="ui-link-transition border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-(--acc) hover:text-(--acc) dark:border-gray-700 dark:text-gray-300"
						onclick={revealMore}
					>
						Load More
					</button>
				</div>
			{/if}
		{/if}
	</div>
</main>
