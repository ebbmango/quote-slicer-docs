<!-- This component might seem overengineered. However, it serves a complex purpose:    -->
<!-- If JavaScript is disabled, provide a simple and semantic <details/> as a fallback. -->
<!-- If JavaScript is enabled, instead of replacing the component entirely, enhance it. -->
<!-- There is no simple way of doing this. -->

<!-- TODO: file became messy with gradient fix, refactor it alongside navlink & navbar -->

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

	let listHeight = $derived(
		list !== null ? (dropdownState === 'open' ? `${list.scrollHeight + 28}px` : '0px') : undefined
	);

	let listMarginTop = $derived(
		list !== null ? (dropdownState === 'open' ? '1.25rem' : '0px') : undefined
	);

	const ANIMATION_MS = 500;
	const animationDuration = `${ANIMATION_MS}ms`;

	function toggleDetails(event: MouseEvent) {
		event.preventDefault();

		clearTimeout(transitionTimer);

		if (dropdownState === 'closed' || dropdownState === 'closing') {
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
	style:--dropdown-duration={animationDuration}
	class:mb-7={dropdownState === 'closed' || dropdownState === 'closing'}
>
	<summary class="dropdown-summary" onclick={toggleDetails}>
		<span class="dropdown-title nav-header">
			{title}
		</span>
		<span class="dropdown-arrow" class:rotate-45={dropdownState === 'open'}>
			<Fa icon={faArrowDownRight} />
		</span>
	</summary>
	<div class="dropdown-list-frame" style:margin-top={listMarginTop} style:height={listHeight}>
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
	.dropdown-summary {
		display: flex;
		width: 100%;
		cursor: pointer;
		align-items: center;
		justify-content: space-between;
	}

	:global(html.js) .dropdown-summary {
		transition: margin-bottom 500ms ease;
	}

	:global(html.no-js) .dropdown[open] > .dropdown-summary {
		margin-bottom: 1.25rem;
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
		--dropdown-fade-color: var(--color-white);
		--dropdown-fade-height: 35px;

		position: relative;
		width: 100%;
		overflow: hidden;
		transition-property: height, margin-top;
		transition-duration: var(--dropdown-duration);
		transition-timing-function: ease;
	}

	:global(html.dark) .dropdown-list-frame {
		--dropdown-fade-color: var(--color-noctis);
	}

	.dropdown-list-frame::after {
		content: '';
		pointer-events: none;
		position: absolute;
		inset-inline: 0;
		bottom: 0;
		height: calc(100% + var(--dropdown-fade-height));
		background: linear-gradient(
			to bottom,
			transparent 0,
			transparent calc(100% - var(--dropdown-fade-height)),
			var(--dropdown-fade-color) 100%
		);
		transition: height var(--dropdown-duration) ease;
	}

	.dropdown-list {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 0.375rem;
		font-family: var(--font-inter);
		font-weight: 300;
	}

	.dropdown-item {
		width: 100%;
	}

	.dropdown-link {
		display: inline-block;
		width: 100%;
		transition:
			color 500ms ease,
			transform 500ms ease;
	}

	.dropdown-link:is(:hover, :focus-visible) {
		color: var(--acc);
		transform: translateX(0.25rem);
	}
</style>
