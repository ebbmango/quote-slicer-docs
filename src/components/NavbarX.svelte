<script lang="ts">
	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import { faBook, faMoon, faSunBright } from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';
	import Logo from './Logo.svelte';
	import { theme } from '$lib/theme';
	import { articleTree } from '$lib/navigation/articleTree';
	import type { Article, NavigationNode, Section } from '$lib/navigation/articleTypes';
	import { diaryNavItem } from '$lib/navigation/articleLookup';
	import {
		faArrowRight,
		faBookArrowRight,
		faBookBlank,
		faBooks,
		faDash,
		faMemo,
		faNewspaper,
		faSection
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';

	let icon = $derived(theme.current === 'dark' ? faMoon : faSunBright);

	function hasChildren(node: NavigationNode): node is Section {
		return 'children' in node;
	}

	const toggle = () => {
		const nextMode = theme.current === 'dark' ? 'light' : 'dark';
		theme.current = nextMode;
	};
</script>

{#snippet renderArticle(article: Article)}
	<li class="list-none">
		<a
			class="group relative flex items-center justify-between opacity-60 max-[600px]:justify-center min-[600px]:w-full"
			href={resolve(article.path)}
		>
			<span class="nav-header duration-500 min-[600px]:group-hocus:translate-x-2">
				{article.title}
			</span>
			<Fa
				icon={faArrowRight}
				class="-right-6 opacity-30 duration-500 group-hocus:opacity-70 max-[600px]:absolute max-[600px]:group-hocus:translate-x-1"
			/>
		</a>
	</li>
{/snippet}

{#snippet renderSection(section: Section)}
	<section class="flex w-full flex-col gap-2 max-[600px]:items-center">
		<span class="nav-header relative flex cursor-default items-center">
			<span class="opacity-60">
				{section.title}
			</span>
		</span>
		<ul class="flex flex-col gap-1 max-[600px]:items-center min-[600px]:ms-2">
			{#each section.children as article}
				<li class="flex w-full max-[600px]:justify-center">
					<a
						class="nav-nested acc-{article.nestedIndex %
							9} duration-500 hocus:opacity-100 touch:w-auto touch:text-(--acc) touch:opacity-70 dark:touch:opacity-100 mouse:flex mouse:w-full mouse:opacity-30 max-[600px]:mouse:justify-center mouse:hocus:text-(--acc) min-[600px]:mouse:hocus:ps-1"
						href={resolve(article.path)}>{article.title}</a
					>
				</li>
			{/each}
		</ul>
	</section>
{/snippet}

<div class="top-nav-shell">
	<input
		id="show-nav"
		checked
		class="nav-toggle"
		type="checkbox"
		aria-label="Toggle navigation menu"
	/>

	<nav class="top-nav sticky top-0 flex h-23 w-full items-center justify-between gap-10 px-5">
		<Logo />
		<div class="flex items-center justify-between gap-4 pe-2 text-xl">
			<!-- Navbar Toggle -->
			<div class="relative flex items-center justify-center">
				<label
					for="show-nav"
					class="nav-toggle-label flex size-5 items-center justify-center opacity-30 hover:opacity-50"
				>
					<Fa icon={faBook}></Fa>
				</label>
			</div>
			<!-- Theme Toggle -->
			<button onclick={toggle} class="size-5 opacity-30 no-js:hidden">
				<Fa {icon}></Fa>
			</button>
		</div>
	</nav>

	<div id="top-nav-modal" class="z-1 flex bg-(--page-bg) px-6">
		<div
			class="top-nav-list flex h-full w-full flex-col gap-5 overflow-scroll max-[600px]:items-center"
		>
			{#each articleTree as node (node.title)}
				{#if hasChildren(node)}
					{@render renderSection(node)}
				{:else}
					{@render renderArticle(node)}
				{/if}
			{/each}
			{@render renderArticle(diaryNavItem)}
		</div>
	</div>
</div>

<style>
	.nav-toggle {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.nav-toggle-label {
		cursor: pointer;
		transition: opacity 180ms ease;
	}

	#top-nav-modal {
		--modal-width: 100%;

		display: flex;
		flex-direction: column;
		position: absolute;
		width: var(--modal-width);
		top: 5.75rem;
		inset-inline: 0;
		height: calc(100dvh - 5.75rem);
		opacity: 0;
		pointer-events: none;
		transform: translateX(-0.75rem);
		visibility: hidden;
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			visibility 0s linear 180ms,
			background-color 500ms;
	}

	#show-nav:checked ~ nav .nav-toggle-label {
		opacity: 0.7;
	}

	#show-nav:checked ~ #top-nav-modal {
		opacity: 1;
		pointer-events: auto;
		transform: translateX(0);
		visibility: visible;
		transition:
			opacity 180ms ease,
			transform 180ms ease,
			visibility 0s,
			background-color 500ms ease;
	}

	.top-nav-list {
		padding-block: 0.75rem 2rem;
		scroll-padding-block: 0.75rem 2rem;
	}

	.top-nav-list > :first-child {
		margin-block-start: auto;
	}

	.top-nav-list > :last-child {
		margin-block-end: auto;
	}

	@media (min-width: 600px) {
		#top-nav-modal {
			--modal-width: 17.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-toggle-label,
		#top-nav-modal {
			transition: none;
		}

		#top-nav-modal {
			transform: none;
		}
	}
</style>
