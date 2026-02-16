<script lang="ts">
	import { docsStructure } from '$lib/constants/docs-structure';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import Dropdown from './Navigation/NavbarDropdown.svelte';
	import Navlink from './Navigation/Navlink.svelte';
	import Logo from './Logo.svelte';
	import { resolve } from '$app/paths';

	type Props = { width: number };

	let { width }: Props = $props();
	let viewportHeight = $state(0);

	const sections = docsStructure;
	const NAV_MIN_HEIGHT = 560;
	const NAV_MAX_HEIGHT = 900;
	const SAFE_MARGIN = 8;
	const LOGO_TOP = 24;
	const LOGO_HEIGHT = 68;
	const TOGGLE_HEIGHT = 80;
	const TOGGLE_VERTICAL_MARGIN = 4;
	const MENU_GAP_MIN = 2;
	const MENU_GAP_MAX = 20;
	const MENU_SHIFT_MIN = -10;
	const MENU_SHIFT_MAX = -32;
	const MENU_PADDING_MIN = 12;
	const MENU_PADDING_MAX = 36;
	const BOTTOM_SAFE_EXTRA = 4;

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
		class="hide-bar relative w-full overflow-scroll px-7"
		style="margin-top: {menuTop}px; max-height: calc(100% - {menuTop}px - {menuBottomInset}px); transform: translateY({menuShift}px); padding-top: {menuPaddingY}px; padding-bottom: {menuPaddingY}px;"
	>
		<ul
			class="acc-cycle hide-bar flex h-full w-full flex-col overflow-scroll overflow-x-hidden text-nowrap"
		>
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
	</section>
	<footer class="absolute bottom-0 flex w-full justify-center" style="height: {footerHeight}px;">
		<DarkModeToggle />
	</footer>
</nav>
