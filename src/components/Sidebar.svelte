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
	const accentTimers = new WeakMap<HTMLHeadingElement, number>();

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

		const article = document.querySelector('article');
		const source = event.currentTarget as HTMLElement;
		const isAtTarget = article
			? isHeadingAtScrollTarget(headings.element, article as HTMLElement)
			: false;

		if (isAtTarget) {
			bumpHeading(headings.element);
			return;
		}

		headings.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		accentHeading(headings.element, source);
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
			class="tree-link my-1 w-fit text-left text-sm text-nowrap opacity-60 transition hover:translate-x-1 hover:text-(--acc) hover:opacity-100"
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
	class="ui-surface-transition contents-sidebar h-vh flex flex-col items-center overflow-scroll bg-gray-50 py-5 font-mono dark:bg-noctis"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto;"
>
	<button
		type="button"
		class="mb-4 bg-noctis px-2 text-gray-50 opacity-20 dark:bg-gray-300 dark:text-noctis dark:hover:opacity-70"
		style:transition-property={'background-color, border-color, color, opacity'}
		style:transition-duration={'var(--ui-transition-duration), var(--ui-transition-duration), var(--ui-transition-duration), 180ms'}
		style:transition-timing-function={
			'var(--ui-transition-timing-function), var(--ui-transition-timing-function), var(--ui-transition-timing-function), ease-out'
		}
		onpointerenter={(event) => ((event.currentTarget as HTMLElement).style.opacity = '0.5')}
		onpointerleave={(event) => ((event.currentTarget as HTMLElement).style.opacity = '0.2')}
		onclick={handleTopClick}
	>
		{headings?.title}
	</button>

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
