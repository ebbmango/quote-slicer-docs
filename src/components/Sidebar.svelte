<script lang="ts">
	import { onMount } from 'svelte';
	import type { TocHeading } from '$lib/navigation/tocTypes';

	let { headings = [] }: { headings?: TocHeading[] } = $props();
	let scrollContainer: HTMLElement | null = null;

	onMount(() => {
		scrollContainer = document.querySelector<HTMLElement>('article');
	});

	function handleHeadingClick(id: string) {
		const element: HTMLElement | null = document.getElementById(id);

		if (!element || !scrollContainer) return;
		if (!isHeadingAtScrollTarget(element, scrollContainer)) return;

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

	function isHeadingAtScrollTarget(target: HTMLElement, container: HTMLElement) {
		const targetRect = target.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop || '0');
		const targetTop = targetRect.top - containerRect.top + container.scrollTop;
		const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
		const expectedScrollTop = Math.min(Math.max(targetTop - scrollMarginTop, 0), maxScrollTop);

		return Math.abs(container.scrollTop - expectedScrollTop) <= 2;
	}
</script>

<aside class="contents-sidebar flex min-w-70 flex-col justify-between">
	<div class="flex h-full items-center justify-end pe-1">
		{#if headings.length > 0}
			<ul class="flex flex-col gap-3 text-right">
				{#each headings as heading (heading.id)}
					{@render renderHeading(heading)}
				{/each}
			</ul>
		{/if}
	</div>
</aside>

{#snippet renderHeading(heading: TocHeading)}
	<li class="text-md my-0.5 font-inter font-light acc-{heading.position % 9}">
		<a
			href={`#${heading.id}`}
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
