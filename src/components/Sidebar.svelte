<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { findArticleByPath } from '$lib/worldTree';

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
	const accentTimers = new WeakMap<HTMLHeadingElement, number>();
	let currentArticle = $derived(findArticleByPath(normalizePathname(page.url.pathname)));

	function normalizePathname(pathname: string) {
		if (!base) return pathname || '/';

		const trimmed = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
		return trimmed || '/';
	}

	function isHeadingAtScrollTarget(target: HTMLElement, container: HTMLElement) {
		const targetRect = target.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop || '0');
		const expectedTop = containerRect.top + scrollMarginTop;

		return Math.abs(targetRect.top - expectedTop) <= 2;
	}

	function clearHeadingEffects(target: HTMLHeadingElement) {
		target.classList.remove('toc-target-flash');
		target.classList.remove('toc-target-accent');
		target.style.removeProperty('--toc-flash-accent');

		const activeTimer = accentTimers.get(target);
		if (activeTimer) {
			window.clearTimeout(activeTimer);
			accentTimers.delete(target);
		}
	}

	function bumpHeading(target: HTMLHeadingElement) {
		clearHeadingEffects(target);

		void target.offsetWidth;
		target.classList.add('toc-target-flash');

		target.addEventListener(
			'animationend',
			() => {
				target.classList.remove('toc-target-flash');
			},
			{ once: true }
		);
	}

	function accentHeading(target: HTMLHeadingElement, source: HTMLElement | null) {
		const accent = source ? getComputedStyle(source).getPropertyValue('--acc').trim() : '';

		clearHeadingEffects(target);
		if (accent) {
			target.style.setProperty('--toc-flash-accent', accent);
		}

		requestAnimationFrame(() => {
			target.classList.add('toc-target-accent');
		});

		const timer = window.setTimeout(() => {
			target.classList.remove('toc-target-accent');
			target.style.removeProperty('--toc-flash-accent');
			accentTimers.delete(target);
		}, 800);

		accentTimers.set(target, timer);
	}

	function handleHeadingClick(heading: Heading, event: MouseEvent) {
		const article = document.querySelector('article');
		const source = (event.currentTarget as HTMLElement).closest('.tree-item') as HTMLElement | null;
		const isAtTarget = article
			? isHeadingAtScrollTarget(heading.element, article as HTMLElement)
			: false;

		if (isAtTarget) {
			bumpHeading(heading.element);
			return;
		}

		heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		accentHeading(heading.element, source);
	}

	function handleTopClick(event: MouseEvent) {
		if (!headings?.element) return;

		headings.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

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
			class="tree-link my-1 w-fit text-left font-inter text-sm font-light text-nowrap opacity-40 duration-500 hover:-translate-x-1 hover:text-(--acc) hover:opacity-100"
			onclick={(event) => handleHeadingClick(heading, event)}
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

<!-- todo: derive whether or not this should be displayed, and hook it to the animation -->
<aside
	class="ui-surface-transition contents-sidebar h-vh jut flex flex-col items-center justify-center overflow-scroll py-5 dark:bg-noctis"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto;"
>
	<!-- <button
		type="button"
		class={`text nav-header mb-4 px-2 text-right opacity-40 dark:bg-gray-300 dark:text-noctis ${currentArticle ? `acc-${currentArticle.accentIndex}` : ''}`}
		style:transition-property={'background-color, border-color, color, opacity'}
		style:transition-duration={'var(--ui-transition-duration), var(--ui-transition-duration), var(--ui-transition-duration), var(--ui-transition-duration)'}
		style:transition-timing-function={'var(--ui-transition-timing-function), var(--ui-transition-timing-function), var(--ui-transition-timing-function), var(--ui-transition-timing-function)'}
		onpointerenter={(event) => ((event.currentTarget as HTMLElement).style.opacity = '1')}
		onpointerleave={(event) => ((event.currentTarget as HTMLElement).style.opacity = '0.2')}
		onclick={handleTopClick}
	>
		{headings?.title}
		in this article
	</button> -->

	{#if headings}
		<ul class="contents-tree flex flex-col gap-3 text-right">
			{#each headings.children as heading}
				{@render renderHeading(heading)}
			{/each}
		</ul>
	{/if}
</aside>

<style>
	.contents-sidebar {
		/* --tree-line: var(--color-gray-200);
		--tree-label: color-mix(in srgb, currentColor 60%, transparent); */
	}

	.toc-chip:hover {
		background-color: var(--acc, var(--color-noctis));
	}

	:global(html.dark) .toc-chip:hover {
		color: var(--color-noctis);
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
		/* padding-right: 1.4rem; */
	}

	.contents-tree > .tree-item > .tree-branch {
		margin-right: 0.2rem;
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
		right: -0.6rem;
		top: 0;
		bottom: 0;
		width: 1px;
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
		right: -0.6rem;
		top: 0.23rem;
		width: calc(0.75rem + var(--tree-hover-shift));
		height: 0.75rem;
		border-right: 1px solid var(--tree-line);
		border-bottom: 1px solid var(--tree-line);
		/* border-bottom-left-radius: 6px; */
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
		padding-right: 0.4rem;
		/* transition:
			translate var(--ui-transition-duration) var(--ui-transition-timing-function),
			opacity var(--ui-transition-duration) var(--ui-transition-timing-function),
			color var(--ui-transition-duration) var(--ui-transition-timing-function); */
	}

	.tree-link span {
		display: block;
		overflow-wrap: anywhere;
	}
</style>
