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

			const activationY = window.innerHeight * 0.25;
			let current = elements[0].id;

			for (const element of elements) {
				if (element.getBoundingClientRect().top > activationY) break;
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
		const targetRect = target.getBoundingClientRect();
		const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop || '0');
		const targetTop = targetRect.top + window.scrollY;
		const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
		const expectedScrollTop = Math.min(Math.max(targetTop - scrollMarginTop, 0), maxScrollTop);

		return Math.abs(window.scrollY - expectedScrollTop) <= 2;
	}

	function flattenHeadings(headings: TocHeading[]): TocHeading[] {
		return headings.flatMap((heading) => [heading, ...flattenHeadings(heading.children)]);
	}
</script>

<aside class="contents-sidebar sticky top-0 flex h-dvh min-w-70 flex-col justify-between">
	<div class="flex h-full min-h-0 items-center justify-end pe-5">
		{#if headings.length > 0}
			<ul class="hidebar flex max-h-full flex-col gap-3 overflow-y-auto py-8 text-right">
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
			class="group inline-block opacity-30 duration-500 focus-visible:outline-none hocus:-translate-x-1 hocus:text-(--acc) hocus:opacity-70 dark:hocus:opacity-90"
			onclick={() => {
				handleHeadingClick(heading.id);
			}}
		>
			{heading.title}
			<span class="opacity-0 duration-500 group-hocus:opacity-50">#</span>
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
	.toc-current {
		opacity: 0.45;
	}
</style>
