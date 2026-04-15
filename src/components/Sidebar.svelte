<script lang="ts">
	import { page } from '$app/state';
	import { tick } from 'svelte';

	type Heading = {
		title: string | null;
		level: number;
		element: HTMLHeadingElement;
		children: Heading[];
		accentIndex: number;
	};

	function buildHeadingTree(nodeList: NodeListOf<HTMLHeadingElement>): Heading {
		const headings: Heading[] = [...nodeList].map((node) => ({
			title: node.textContent,
			element: node,
			level: Number(node.nodeName[1]),
			children: [],
			accentIndex: 0
		}));

		if (headings.length === 0) {
			throw new Error('buildHeadingTree: headings array is empty');
		}

		const stack: Heading[] = [headings.shift() as Heading];

		for (const next of headings) {
			while (stack[stack.length - 1].level >= next.level) {
				const last = stack.pop()!;
				stack[stack.length - 1].children.push(last);
			}

			stack.push(next);
		}

		while (stack.length > 1) {
			const last = stack.pop()!;
			stack[stack.length - 1].children.push(last);
		}

		let accentIndex = 0;

		function assignAccentIndices(heading: Heading) {
			for (const child of heading.children) {
				child.accentIndex = accentIndex % 9;
				accentIndex += 1;
				assignAccentIndices(child);
			}
		}

		assignAccentIndices(stack[0]);

		return stack[0];
	}

	type Props = { width: number };
	const { width }: Props = $props();

	let headings = $state<Heading | null>(null);

	$effect(() => {
		page.url.pathname; // dependency
		tick().then(() => {
			const article = document.querySelector('article');

			if (!article) {
				headings = null;
				return;
			}

			const nodeList = article.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6');

			try {
				headings = buildHeadingTree(nodeList);
			} catch {
				headings = null;
			}
		});
	});
</script>

{#snippet renderHeading(heading: Heading)}
	<li class={`tree-item acc-${heading.accentIndex}`}>
		<button
			type="button"
			class="tree-link my-1 w-fit text-left text-sm text-nowrap opacity-60 transition hover:translate-x-1 hover:text-(--acc) hover:opacity-100"
			onclick={() => heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' })}
		>
			<span>
				{heading.title}
			</span>
		</button>
		{#if heading.children.length > 0}
			<ul class="tree-branch">
				{#each heading.children as child}
					{@render renderHeading(child)}
				{/each}
			</ul>
		{/if}
	</li>
{/snippet}

<aside
	class="ui-surface-transition contents-sidebar h-vh flex flex-col items-center overflow-scroll bg-gray-50 py-5 font-mono dark:bg-noctis"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto;"
>
	<span
		class="mb-4 bg-noctis px-2 text-gray-50 opacity-20 duration-500 dark:bg-gray-300 dark:text-noctis"
		>{headings?.title}</span
	>

	{#if headings}
		<ul class="contents-tree flex flex-col gap-3">
			{#each headings.children as heading}
				{@render renderHeading(heading)}
			{/each}
		</ul>
	{/if}
</aside>

<style>
	.contents-sidebar {
		--tree-line: var(--color-tin);
		--tree-label: color-mix(in srgb, currentColor 60%, transparent);
	}

	:global(html.dark) .contents-sidebar {
		--tree-line: var(--color-steel);
	}

	.contents-tree,
	.tree-branch {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.tree-branch {
		padding-left: 1.4rem;
	}

	.contents-tree > .tree-item > .tree-branch {
		margin-left: 0.2rem;
	}

	.tree-item {
		position: relative;
		color: inherit;
		--tree-hover-shift: 0rem;
		transition: color var(--ui-transition-duration) var(--ui-transition-timing-function);
	}

	.tree-item::before {
		content: '';
		position: absolute;
		left: -0.6rem;
		top: 0;
		bottom: 0;
		width: 2px;
		background-color: var(--tree-line);
		transition: background-color var(--ui-transition-duration) var(--ui-transition-timing-function);
	}

	.contents-tree > .tree-item::before,
	.contents-tree > .tree-item::after {
		content: none;
	}

	.tree-item::after {
		content: '';
		position: absolute;
		left: -0.6rem;
		top: 0.23rem;
		width: calc(0.75rem + var(--tree-hover-shift));
		height: 0.75rem;
		border-left: 2px solid var(--tree-line);
		border-bottom: 2px solid var(--tree-line);
		border-bottom-left-radius: 6px;
		transition:
			width var(--ui-transition-duration) var(--ui-transition-timing-function),
			border-color var(--ui-transition-duration) var(--ui-transition-timing-function);
	}

	.tree-item:has(> .tree-link:hover) {
		--tree-hover-shift: 0.25rem;
	}

	.tree-item:last-child::before {
		bottom: auto;
		height: 0.6rem;
	}

	.tree-link {
		padding-left: 0.4rem;
		transition:
			translate var(--ui-transition-duration) var(--ui-transition-timing-function),
			opacity var(--ui-transition-duration) var(--ui-transition-timing-function),
			color var(--ui-transition-duration) var(--ui-transition-timing-function);
	}

	.tree-link span {
		display: block;
		overflow-wrap: anywhere;
	}
</style>
