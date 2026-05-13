<script lang="ts">
	import { tick } from 'svelte';
	import type { TocHeading } from '$lib/navigation/tocTypes';

	let { headings = [] }: { headings?: TocHeading[] } = $props();
	let activeHeadingId = $state<string | null>(null);
	let flatHeadings = $derived(flattenHeadings(headings));

	$effect(() => {
		const headingIds = flatHeadings.map((heading) => heading.id);
		if (headingIds.length === 0) {
			activeHeadingId = null;
			return;
		}

		let frame = 0;
		let elements: HTMLElement[] = [];
		let cancelled = false;

		const updateActiveHeading = () => {
			if (elements.length === 0) return;

			const currentScrollTop = window.scrollY;
			const maxScrollTop = getMaxScrollTop();
			let current = elements[0].id;

			for (const element of elements) {
				const targetScrollTop = getHeadingTargetScrollTop(element, maxScrollTop);
				if (targetScrollTop > currentScrollTop + 2) break;
				current = element.id;
			}

			activeHeadingId = current;
		};

		const scheduleUpdate = () => {
			if (frame !== 0) return;

			frame = window.requestAnimationFrame(() => {
				frame = 0;
				updateActiveHeading();
			});
		};

		tick().then(() => {
			if (cancelled) return;

			elements = headingIds
				.map((id) => document.getElementById(id))
				.filter((element): element is HTMLElement => element instanceof HTMLElement);

			updateActiveHeading();
			window.addEventListener('scroll', scheduleUpdate, { passive: true });
			window.addEventListener('resize', scheduleUpdate);
			window.addEventListener('hashchange', scheduleUpdate);
		});

		return () => {
			cancelled = true;
			if (frame !== 0) window.cancelAnimationFrame(frame);
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			window.removeEventListener('hashchange', scheduleUpdate);
		};
	});

	function handleHeadingClick(id: string) {
		const element: HTMLElement | null = document.getElementById(id);

		if (!element) return;
		if (!isHeadingAtScrollTarget(element)) return;

		element.animate(
			[
				{ transform: 'translateX(0)' },
				{ transform: 'translateX(0.35rem)' },
				{ transform: 'translateX(0)' }
			],
			{
				duration: 500,
				easing: 'ease-out'
			}
		);
	}

	function isHeadingAtScrollTarget(target: HTMLElement) {
		const expectedScrollTop = getHeadingTargetScrollTop(target, getMaxScrollTop());

		return Math.abs(window.scrollY - expectedScrollTop) <= 2;
	}

	function getHeadingTargetScrollTop(target: HTMLElement, maxScrollTop: number) {
		const targetTop = target.getBoundingClientRect().top + window.scrollY;
		const targetScrollTop = targetTop - getScrollMarginTop(target);

		return Math.min(Math.max(targetScrollTop, 0), maxScrollTop);
	}

	function getMaxScrollTop() {
		return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
	}

	function getScrollMarginTop(element: HTMLElement) {
		return Number.parseFloat(getComputedStyle(element).scrollMarginTop || '0');
	}

	function flattenHeadings(headings: TocHeading[]): TocHeading[] {
		return headings.flatMap((heading) => [heading, ...flattenHeadings(heading.children)]);
	}
</script>

<aside class="contents-sidebar sticky top-0 flex h-dvh min-w-70 flex-col justify-between">
	<div class="toc-edge-gutter flex h-full min-h-0 items-center justify-end">
		{#if headings.length > 0}
			<ul
				class="hidebar -ms-16 flex max-h-full flex-col gap-3 overflow-y-auto py-8 ps-16 text-right"
			>
				{#each headings as heading (heading.id)}
					{@render renderHeading(heading)}
				{/each}
			</ul>
		{/if}
	</div>
</aside>

{#snippet renderHeading(heading: TocHeading)}
	<li class="text-md my-0.5 font-inter font-[250] acc-{heading.position % 9}">
		<a
			href={`#${heading.id}`}
			aria-current={activeHeadingId === heading.id ? 'location' : undefined}
			class:toc-current={activeHeadingId === heading.id}
			class="toc-link group inline-block duration-500 focus-visible:outline-none hocus:-translate-x-1 hocus:text-(--acc)"
			onclick={() => {
				handleHeadingClick(heading.id);
			}}
		>
			{heading.title}
			<span class="opacity-0 duration-500 group-hocus:opacity-60">#</span>
		</a>
		{#if heading.children.length > 0}
			<ul class="tree-branch">
				{#each heading.children as child (child.id)}
					{@render renderHeading(child)}
				{/each}
			</ul>
		{/if}
	</li>
{/snippet}

<style>
	.toc-edge-gutter {
		padding-inline-end: var(--page-edge-gutter);
	}

	.toc-link {
		--toc-link-opacity: 0.3;

		opacity: var(--toc-link-opacity);
	}

	.toc-current {
		--toc-link-opacity: 0.5;
	}

	.toc-link:is(:hover, :focus-visible) {
		--toc-link-opacity: 0.9;
	}

	:global(html.dark) .toc-link:is(:hover, :focus-visible) {
		--toc-link-opacity: 0.9;
	}
</style>
