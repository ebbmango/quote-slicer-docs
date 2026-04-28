<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import Dropdown from './Navigation/Dropdown.svelte';
	import Logo from './Logo.svelte';
	import Navlink from './Navigation/Navlink.svelte';
	import { diaryNavItem, isSection, worldTree } from '$lib/worldTree';

	type Props = { width: number };

	let { width }: Props = $props();
	let viewportHeight = $state(0);

	let menuScroller: HTMLDivElement | null = $state(null);

	// Prevent fade on scrollbar
	let showTopFade = $state(false);
	let showBottomFade = $state(false);

	// Layout
	const NAV_MIN_HEIGHT = 560;
	const NAV_MAX_HEIGHT = 900;
	const LOGO_TOP = 24;
	const MENU_TOP = 76;
	const MENU_BOTTOM_INSET = 122;
	const MENU_SHIFT_MIN = -10;
	const MENU_SHIFT_MAX = -32;

	// Scroll Fade
	const SCROLL_EDGE_FADE = 28;
	const SCROLLBAR_CLEARANCE = 14;

	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
	const lerp = (min: number, max: number, t: number) => min + (max - min) * t;

	let verticalScale = $derived(
		clamp((viewportHeight - NAV_MIN_HEIGHT) / (NAV_MAX_HEIGHT - NAV_MIN_HEIGHT), 0, 1)
	);
	let menuShift = $derived(lerp(MENU_SHIFT_MIN, MENU_SHIFT_MAX, verticalScale));

	const updateScrollFades = () => {
		if (!menuScroller) return;
		const maxScrollTop = Math.max(menuScroller.scrollHeight - menuScroller.clientHeight, 0);
		showTopFade = menuScroller.scrollTop > 0;
		showBottomFade = menuScroller.scrollTop < maxScrollTop;
	};

	onMount(() => {
		const scroller = menuScroller;
		if (!scroller) return;
		updateScrollFades();
		const resizeObserver = new ResizeObserver(updateScrollFades);
		resizeObserver.observe(scroller);
		if (scroller.firstElementChild instanceof HTMLElement) {
			resizeObserver.observe(scroller.firstElementChild);
		}
		return () => resizeObserver.disconnect();
	});

	$effect(() => {
		viewportHeight;
		queueMicrotask(updateScrollFades);
	});
</script>

<svelte:window bind:innerHeight={viewportHeight} />

<nav
	aria-label="Docs navigation"
	class="ui-surface-transition h-vh relative flex w-70 flex-col justify-center overflow-hidden dark:bg-noctis dark:text-gray-300"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto; overflow: hidden;"
>
	<a
		href={resolve('/')}
		class="absolute top-0 flex w-full justify-center"
		style="margin-top: {LOGO_TOP}px;"
	>
		<Logo />
	</a>

	<section
		aria-label="Articles"
		class="relative w-full overflow-hidden px-7"
		style="margin-top: {MENU_TOP}px; max-height: calc(100% - {MENU_TOP}px - {MENU_BOTTOM_INSET}px); transform: translateY({menuShift}px);"
	>
		<div
			bind:this={menuScroller}
			class="hide-bar h-full overflow-x-hidden overflow-y-scroll"
			style="padding-right: {SCROLLBAR_CLEARANCE}px; margin-right: -{SCROLLBAR_CLEARANCE}px; scrollbar-gutter: stable;"
			onscroll={updateScrollFades}
		>
			<ul class="flex w-full flex-col text-nowrap">
				{#each worldTree as node}
					<li class={`acc-${node.accentIndex}`}>
						{#if isSection(node)}
							<Dropdown section={node} />
						{:else}
							<Navlink article={node} />
						{/if}
					</li>
				{/each}
				<li class={`acc-${diaryNavItem.accentIndex}`}>
					<Navlink article={diaryNavItem} />
				</li>
			</ul>
		</div>
		<!-- Fade Overlays -->
		{#if showTopFade}
			<div
				aria-hidden="true"
				class="ui-gradient-transition pointer-events-none absolute inset-x-0 top-0 z-10 bg-linear-to-b from-white to-transparent dark:from-noctis"
				style="height: {SCROLL_EDGE_FADE}px;"
			></div>
		{/if}
		{#if showBottomFade}
			<div
				aria-hidden="true"
				class="ui-gradient-transition pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-white to-transparent dark:from-noctis"
				style="height: {SCROLL_EDGE_FADE}px;"
			></div>
		{/if}
	</section>
	<!-- <footer class="absolute bottom-0 flex w-full justify-center">
		<DarkModeToggle />
	</footer> -->
</nav>
