<script lang="ts">
	import { docsStructure } from '$lib/constants/docs-structure';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import Dropdown from './Navigation/NavbarDropdown.svelte';
	import Navlink from './Navigation/Navlink.svelte';
	import Logo from './Logo.svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	type Props = { width: number };

	let { width }: Props = $props();
	let viewportHeight = $state(0);
	let menuScroller: HTMLDivElement | null = $state(null);
	let showTopFade = $state(false);
	let showBottomFade = $state(false);

	const sections = docsStructure;
	const NAV_MIN_HEIGHT = 560;
	const NAV_MAX_HEIGHT = 900;
	const SAFE_MARGIN = 8;
	const LOGO_TOP = 24;
	const LOGO_HEIGHT = 50;
	const TOGGLE_HEIGHT = 80;
	const TOGGLE_VERTICAL_MARGIN = 4;
	const MENU_GAP_MIN = 2;
	const MENU_GAP_MAX = 20;
	const MENU_SHIFT_MIN = -10;
	const MENU_SHIFT_MAX = -32;
	const MENU_PADDING_MIN = 12;
	const MENU_PADDING_MAX = 36;
	const BOTTOM_SAFE_EXTRA = 30;
	const SCROLL_EDGE_FADE = 28;
	const SCROLLBAR_CLEARANCE = 14;

	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
	const lerp = (min: number, max: number, t: number) => min + (max - min) * t;

	let verticalScale = $derived(
		clamp((viewportHeight - NAV_MIN_HEIGHT) / (NAV_MAX_HEIGHT - NAV_MIN_HEIGHT), 0, 1)
	);
	let logoTop = LOGO_TOP;
	// Keep menu below the logo block with a variable gap.
	let menuTop = $derived(logoTop + LOGO_HEIGHT + lerp(MENU_GAP_MIN, MENU_GAP_MAX, verticalScale));
	let menuShift = $derived(lerp(MENU_SHIFT_MIN, MENU_SHIFT_MAX, verticalScale));
	let menuPaddingY = $derived(lerp(MENU_PADDING_MIN, MENU_PADDING_MAX, verticalScale));
	// Ensure compact footer is never shorter than toggle height + vertical safety margins.
	let footerHeight = $derived(
		Math.max(TOGGLE_HEIGHT + TOGGLE_VERTICAL_MARGIN * 2, lerp(84, 92, verticalScale))
	);
	// Keep the scroll area clear of the toggle/footer stack near the bottom.
	let menuBottomInset = $derived(footerHeight + BOTTOM_SAFE_EXTRA);

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
		menuTop;
		menuBottomInset;
		menuPaddingY;
		queueMicrotask(updateScrollFades);
	});
</script>

<svelte:window bind:innerHeight={viewportHeight} />

<nav
	aria-label="Docs navigation"
	class="ui-surface-transition h-vh relative flex w-70 flex-col justify-center overflow-hidden bg-gray-50 dark:bg-noctis dark:text-gray-300"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto; overflow: hidden;"
>
	<a href={resolve('/')} class="absolute top-0 flex w-full justify-center" style="margin-top: {logoTop}px;">
		<Logo />
	</a>

	<section
		aria-label="Articles"
		class="relative w-full overflow-hidden px-7"
		style="margin-top: {menuTop}px; max-height: calc(100% - {menuTop}px - {menuBottomInset}px); transform: translateY({menuShift}px);"
	>
		<div
			bind:this={menuScroller}
			class="hide-bar h-full overflow-y-scroll overflow-x-hidden"
			style="padding-top: {menuPaddingY}px; padding-bottom: {menuPaddingY}px; padding-right: {SCROLLBAR_CLEARANCE}px; margin-right: -{SCROLLBAR_CLEARANCE}px; scrollbar-gutter: stable;"
			onscroll={updateScrollFades}
		>
			<ul class="acc-cycle flex w-full flex-col text-nowrap">
				{#each sections as section, i}
					<li>
						{#if section.children}
							<Dropdown {section} />
						{:else}
							<Navlink {section} />
						{/if}
					</li>
				{/each}
			</ul>
		</div>
		{#if showTopFade}
			<div
				aria-hidden="true"
				class="ui-gradient-transition pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-gray-50 to-transparent dark:from-noctis"
				style="height: {SCROLL_EDGE_FADE}px;"
			></div>
		{/if}
		{#if showBottomFade}
			<div
				aria-hidden="true"
				class="ui-gradient-transition pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-gray-50 to-transparent dark:from-noctis"
				style="height: {SCROLL_EDGE_FADE}px;"
			></div>
		{/if}
	</section>
	<footer class="absolute bottom-0 flex w-full justify-center" style="height: {footerHeight}px;">
		<DarkModeToggle />
	</footer>
</nav>
