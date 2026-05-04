<!-- Enhanced details: native no-JS fallback, animated panel when JS is available. -->
<!-- NOTE: (bug) dropdown gradient persists after expansion on small (short) screens -->

<script lang="ts">
	import Fa from 'svelte-fa';
	import { resolve } from '$app/paths';
	import { faArrowDownRight } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';
	import { onDestroy } from 'svelte';
	import type { Section } from '$lib/navigation/articleTypes';

	type Props = {
		section: Section;
	};

	let list = $state<HTMLUListElement | null>(null);
	const { section }: Props = $props();
	let title = $derived(section.title);

	type DropdownState = 'closed' | 'open' | 'closing';

	let dropdownState = $state<DropdownState>('closed');
	let transitionTimer: ReturnType<typeof setTimeout> | undefined;
	let isOpen = $derived(dropdownState === 'open');
	let panelHeight = $derived(list ? (isOpen ? `${list.scrollHeight}px` : '0px') : undefined);

	const ANIMATION_MS = 500;
	const animationDuration = `${ANIMATION_MS}ms`;

	function toggleDetails(event: MouseEvent) {
		event.preventDefault();
		clearTimeout(transitionTimer);

		if (!isOpen) {
			dropdownState = 'open';
			return;
		}

		dropdownState = 'closing';

		transitionTimer = setTimeout(() => {
			dropdownState = 'closed';
		}, ANIMATION_MS);
	}

	onDestroy(() => {
		clearTimeout(transitionTimer);
	});
</script>

<details
	class="dropdown duration-500"
	open={dropdownState !== 'closed'}
	class:dropdown-open={isOpen}
	style:--dropdown-duration={animationDuration}
>
	<summary class="dropdown-summary" onclick={toggleDetails}>
		<span class="dropdown-title nav-header">
			{title}
		</span>
		<span class="dropdown-arrow" class:rotate-45={isOpen}>
			<Fa icon={faArrowDownRight} />
		</span>
	</summary>
	<div class="dropdown-list-frame" style:height={panelHeight}>
		<ul bind:this={list} class="dropdown-list acc-cycle">
			{#each section.children as navlink (navlink.path)}
				<li class="dropdown-item">
					<a class="dropdown-link" href={resolve(navlink.path)}>{navlink.title}</a>
				</li>
			{/each}
		</ul>
	</div>
</details>

<style>
	.dropdown {
		--dropdown-list-gap: 0.625rem;
		--dropdown-sibling-gap: 1.75rem;
		--dropdown-fade-height: 28px;

		margin-block-end: var(--dropdown-sibling-gap);
	}

	:global(html.js) .dropdown {
		transition: margin-block-end var(--dropdown-duration) ease;
	}

	:global(html.js) .dropdown.dropdown-open {
		margin-block-end: 0;
	}

	.dropdown-summary {
		display: flex;
		width: 100%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
	}

	summary {
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.dropdown-title {
		transition: transform var(--dropdown-duration) ease;
	}

	:global(html.js) .dropdown-summary:is(:hover, :focus-visible) .dropdown-title {
		transform: translateX(0.5rem);
	}

	.dropdown-arrow {
		margin-inline-end: 0.5rem;
		transition-property: opacity, rotate;
		transition-duration: var(--dropdown-duration), var(--dropdown-duration);
		transition-timing-function: ease;
	}

	:global(html.js) .dropdown-arrow {
		opacity: 0;
	}

	:global(html.no-js) .dropdown-arrow {
		opacity: 0.2;
		transition-duration: 300ms, 0ms;
	}

	.dropdown-summary:is(:hover, :focus-visible) .dropdown-arrow {
		opacity: 0.3;
	}

	:global(html.no-js) .dropdown-summary:is(:hover, :focus-visible) .dropdown-arrow {
		opacity: 0.6;
	}

	.dropdown-list-frame {
		width: 100%;
		overflow: hidden;
	}

	:global(html.js) .dropdown-list-frame {
		transition: height var(--dropdown-duration) ease;
		-webkit-mask-image: linear-gradient(
			to bottom,
			black,
			black calc(100% - var(--dropdown-fade-height)),
			transparent
		);
		mask-image: linear-gradient(
			to bottom,
			black,
			black calc(100% - var(--dropdown-fade-height)),
			transparent
		);
	}

	.dropdown-list {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 0.375rem;
		padding-block-start: var(--dropdown-list-gap);
		font-family: var(--font-inter);
		font-weight: 300;
	}

	:global(html.js) .dropdown-list {
		padding-block-end: var(--dropdown-fade-height);
	}

	.dropdown-item {
		width: 100%;
	}

	.dropdown-link {
		opacity: 30%;
		display: inline-block;
		width: 100%;
		transition:
			color 500ms ease,
			transform 500ms ease,
			opacity 500ms ease;
	}

	.dropdown-link:is(:hover, :focus-visible) {
		color: var(--acc);
		transform: translateX(0.25rem);
		opacity: 90%;
	}
</style>
