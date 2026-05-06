<script lang="ts">
	import { resolve } from '$app/paths';
	import { diaryEntries } from '$lib/generated/diary-index';
</script>

<svelte:head>
	<title>Development Diary</title>
</svelte:head>

<main class="hidebar h-dvh w-full overflow-y-auto bg-white px-8 py-8 dark:bg-umbra">
	<div class="mx-auto flex w-full max-w-4xl flex-col text-noctis dark:text-gray-100">
		<article
			class="prose-transition prose prose-xl w-full min-w-0 font-inter font-light dark:prose-invert prose-headings:font-dm-serif prose-headings:font-light prose-headings:tracking-normal prose-h1:normal-case prose-code:font-mono prose-pre:font-mono"
		>
			<h1 class="title">Develop&shy;ment Diary</h1>
		</article>

		<p class="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
			Chronological notes about implementation details, design decisions, and experiments.
		</p>

		<p class="mt-8 text-sm text-gray-500 dark:text-gray-400">
			{diaryEntries.length} {diaryEntries.length === 1 ? 'entry' : 'entries'}
		</p>

		<ul class="mt-8 flex flex-col gap-6">
			{#each diaryEntries as entry}
				<li class="border-b border-gray-200 pb-6 dark:border-gray-800">
					<a
						href={resolve('/(article-shell)/(diary)/development-diary/[slug]', {
							slug: entry.slug
						})}
						class="block"
					>
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
	</div>
</main>
