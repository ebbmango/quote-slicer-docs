<script lang="ts">
	// TODO: fix: the sun is always the first icon to show
	// when updating the page, if dark mode is enabled, first the sun
	// shows up, and then the toggle rotates

	import { onDestroy } from 'svelte';
	import Fa from 'svelte-fa';
	import { theme } from '$lib/theme';
	import {
		faMoon as MoonSolid,
		faSunBright as SunSolid
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';
	import {
		faMoon as MoonLight,
		faSunBright as SunLight
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';

	type ThemeControl = 'sun' | 'moon';
	type ThemeIcon = typeof SunLight;
	type PointerPosition = { x: number; y: number };

	const initialMode = theme.current;
	let displayedMode = initialMode;
	let rotation = $state(initialMode === 'dark' ? 180 : 0);
	let hoveredControl = $state<ThemeControl | null>(null);
	let focusedControl = $state<ThemeControl | null>(null);
	let activeControl = $derived(hoveredControl ?? focusedControl);
	let sunButton: HTMLButtonElement | null = null;
	let moonButton: HTMLButtonElement | null = null;
	let pointer: PointerPosition | null = null;
	let hoverFrame = 0;

	const toggle = () => {
		const nextMode = theme.current === 'dark' ? 'light' : 'dark';
		rotation += 180;
		displayedMode = nextMode;
		theme.current = nextMode;
	};

	$effect(() => {
		const currentMode = theme.current;
		if (currentMode === displayedMode) return;

		rotation += 180;
		displayedMode = currentMode;
	});

	const controlAt = (target: Element | null): ThemeControl | null => {
		const controls: Array<[ThemeControl, HTMLButtonElement | null]> = [
			['sun', sunButton],
			['moon', moonButton]
		];

		return controls.find(([, button]) => target && button?.contains(target))?.[0] ?? null;
	};

	const syncHoveredControl = () => {
		hoveredControl = pointer ? controlAt(document.elementFromPoint(pointer.x, pointer.y)) : null;
	};

	const trackPointer = (event: PointerEvent) => {
		pointer = { x: event.clientX, y: event.clientY };
		syncHoveredControl();
	};

	const startHoverTracking = (event: PointerEvent) => {
		trackPointer(event);
		if (hoverFrame) return;

		const tick = () => {
			syncHoveredControl();
			hoverFrame = requestAnimationFrame(tick);
		};

		hoverFrame = requestAnimationFrame(tick);
	};

	const stopHoverTracking = () => {
		pointer = null;
		hoveredControl = null;
		if (hoverFrame && typeof cancelAnimationFrame === 'function') {
			cancelAnimationFrame(hoverFrame);
		}
		hoverFrame = 0;
	};

	onDestroy(stopHoverTracking);
</script>

{#snippet iconPair(control: ThemeControl, lightIcon: ThemeIcon, solidIcon: ThemeIcon)}
	<span
		class="theme-toggle-icon col-start-1 row-start-1"
		class:opacity-0={activeControl === control}
		class:opacity-40={activeControl !== control}
	>
		<Fa icon={lightIcon} />
	</span>
	<span
		class="theme-toggle-icon col-start-1 row-start-1"
		class:opacity-60={activeControl === control}
		class:opacity-0={activeControl !== control}
	>
		<Fa icon={solidIcon} />
	</span>
{/snippet}

<div
	class="circadian absolute -bottom-9 flex min-h-20 w-10 flex-col items-center justify-between rounded-full"
	style:rotate={`${rotation}deg`}
	role="group"
	aria-label="Theme toggle"
	onpointerenter={startHoverTracking}
	onpointermove={trackPointer}
	onpointerleave={stopHoverTracking}
>
	<!-- Negative tabindex prevents focus on the inactive button from breaking the layout during scroll -->
	<button
		bind:this={sunButton}
		class="outline-none focus:outline-none focus-visible:outline-none"
		onfocus={() => (focusedControl = 'sun')}
		onblur={() => (focusedControl = null)}
		onclick={toggle}
		tabindex={theme.current === 'light' ? 0 : -1}
	>
		<span class="circadian grid text-xl" style:rotate={`${-rotation}deg`}>
			{@render iconPair('sun', SunLight, SunSolid)}
		</span>
	</button>
	<button
		bind:this={moonButton}
		class="outline-none focus:outline-none focus-visible:outline-none"
		onfocus={() => (focusedControl = 'moon')}
		onblur={() => (focusedControl = null)}
		onclick={toggle}
		tabindex={theme.current === 'dark' ? 0 : -1}
	>
		<span class="circadian grid text-xl" style:rotate={`${-rotation}deg`}>
			{@render iconPair('moon', MoonLight, MoonSolid)}
		</span>
	</button>
</div>

<style>
	.circadian {
		--icon-opacity-duration: 400ms;

		transition:
			rotate 800ms,
			color 400ms;
	}

	:global(.theme-toggle-icon) {
		transition: opacity var(--icon-opacity-duration);
	}
</style>
