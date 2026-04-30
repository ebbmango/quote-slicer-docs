<script lang="ts">
	import { onMount } from 'svelte';
	import { buildHeadingTree, type Heading, type HeadingTree } from '$lib/navigation/headingTree';
	import Fa from 'svelte-fa';

	import {
		faList as faListSolid,
		faListTree as listTreeSolid
	} from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import {
		faList as faListLight,
		faListTree as listTreeLight
	} from '@awesome.me/kit-d1ffd5714e/icons/classic/light';

	let headings = $state<HeadingTree | null>(null);

	let showTree = $state(false);

	function isHeadingAtScrollTarget(target: HTMLElement, container: HTMLElement) {
		const targetRect = target.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const scrollMarginTop = Number.parseFloat(getComputedStyle(target).scrollMarginTop || '0');
		const targetTop = targetRect.top - containerRect.top + container.scrollTop;
		const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
		const expectedScrollTop = Math.min(Math.max(targetTop - scrollMarginTop, 0), maxScrollTop);

		return Math.abs(container.scrollTop - expectedScrollTop) <= 2;
	}

	function handleHeadingClick(heading: Heading) {
		const article = document.querySelector('article');
		const isAtTarget = article
			? isHeadingAtScrollTarget(heading.element, article as HTMLElement)
			: false;

		if (isAtTarget) bumpHeading(heading.element);
		else heading.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function bumpHeading(target: HTMLHeadingElement) {
		target.animate(
			[
				{ transform: 'translateX(0)' },
				{ transform: 'translateX(0.25rem)' },
				{ transform: 'translateX(0)' }
			],
			{
				duration: 600,
				easing: 'ease'
			}
		);
	}

	function rebuildHeadings(article: HTMLElement) {
		const nodeList = article.querySelectorAll<HTMLHeadingElement>('h2, h3, h4');
		headings = buildHeadingTree(nodeList);
	}

	onMount(() => {
		const article = document.querySelector<HTMLElement>('article');

		if (!article) {
			headings = null;
			return;
		}

		const observer = new MutationObserver(() => rebuildHeadings(article));

		observer.observe(article, { childList: true, subtree: true });
		rebuildHeadings(article);

		return () => observer.disconnect();
	});
</script>

<aside class="flex min-w-70 flex-col justify-between">
	<div class="flex h-full items-center justify-end pe-1">
		{#if headings && headings.children.length > 0}
			<ul class="flex flex-col gap-3 text-right">
				{#each headings.children as heading}
					<!-- {heading.title} -->
					{@render renderHeading(heading)}
				{/each}
			</ul>
		{/if}
	</div>
	<div class="flex h-19 items-center justify-center text-xl">
		<button
			class="group flex"
			class:hidden={showTree}
			onclick={() => {
				showTree = !showTree;
			}}
		>
			<Fa icon={listTreeLight} class="opacity-30 duration-500 group-hover:opacity-0" />
			<Fa icon={listTreeSolid} class="absolute opacity-0 duration-500 group-hover:opacity-60" />
		</button>
		<button
			class="group flex"
			class:hidden={!showTree}
			onclick={() => {
				showTree = !showTree;
			}}
		>
			<Fa icon={faListLight} class="opacity-30 duration-500 group-hover:opacity-0" />
			<Fa icon={faListSolid} class="absolute opacity-0 duration-500 group-hover:opacity-60" />
		</button>
	</div>
</aside>

{#snippet renderHeading(heading: Heading)}
	<li class="text-md my-0.5 font-inter font-light acc-{heading.position % 9}">
		<button
			type="button"
			class="group opacity-30 duration-500 focus-visible:outline-none hocus:-translate-x-1 hocus:text-(--acc) hocus:opacity-70"
			onclick={() => handleHeadingClick(heading)}
		>
			{heading.title}
			<span class="opacity-0 duration-500 group-hocus:opacity-50">#</span>
		</button>
		<!-- <button
			type="button"
			class="tree-link my-1 w-fit text-right font-inter text-sm font-light text-wrap opacity-40 duration-500 hover:-translate-x-1 hover:text-(--acc) hover:opacity-100"
			onclick={() => handleHeadingClick(heading)}
		>
			<span>
				{heading.title}
			</span>
		</button> -->
		{#if heading.children.length > 0}
			<ul class="tree-branch">
				{#each heading.children as child}
					{@render renderHeading(child)}
				{/each}
			</ul>
		{/if}
	</li>
{/snippet}

<style>
</style>
