<script lang="ts">
	import Fa from 'svelte-fa';

	import {
		faBook as bookSolid,
		faMoon as moonSolid,
		faSunBright as sunSolid,
		faBookArrowRight as bookArrow
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';

	import {
		faBook as bookLight,
		faMoon as moonLight,
		faSunBright as sunLight
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';

	import Logo from './Logo.svelte';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import NavMenu from './Navigation/NavMenu.svelte';
	import { theme } from '$lib/theme';

	let checked = $state(false);

	function closeMobileNav() {
		checked = false;
	}

	const toggle = () => {
		const nextMode = theme.current === 'dark' ? 'light' : 'dark';
		theme.current = nextMode;
	};
</script>

<div class="navbar-shell">
	<input
		id="show-nav"
		class="nav-toggle focus-ring-none"
		type="checkbox"
		bind:checked
		aria-label="Toggle navigation menu"
	/>

	<header class="top-nav sticky top-0 flex w-full items-center justify-between">
		<Logo />
		<div class="flex items-center justify-between gap-4 text-xl">
			<div class="relative flex items-center justify-center">
				<label
					for="show-nav"
					class="nav-toggle-label group focus-ring-none relative flex size-5 items-center justify-center"
				>
					<Fa
						class="absolute opacity-30 transition-opacity duration-180 toggle-checked:opacity-0 mouse:group-hocus:opacity-0"
						icon={bookLight}
					/>
					<Fa
						class="absolute opacity-0 transition-opacity duration-180 group-hocus:opacity-60 toggle-checked:invisible toggle-checked:duration-0 touch:hidden"
						icon={bookArrow}
					/>
					<Fa
						class="absolute opacity-0 transition-opacity toggle-checked:opacity-60 touch:duration-180 mouse:duration-0"
						icon={bookSolid}
					/>
				</label>
			</div>
			<button
				onclick={toggle}
				class="top-theme-toggle focus-ring-none group relative flex size-5 no-js:hidden"
			>
				<span class="top-theme-icon top-theme-light-mode" data-weight="light">
					<Fa icon={sunLight} />
				</span>
				<span class="top-theme-icon top-theme-light-mode" data-weight="solid">
					<Fa icon={sunSolid} />
				</span>
				<span class="top-theme-icon top-theme-dark-mode" data-weight="light">
					<Fa icon={moonLight} />
				</span>
				<span class="top-theme-icon top-theme-dark-mode" data-weight="solid">
					<Fa icon={moonSolid} />
				</span>
			</button>
		</div>
	</header>

	<nav aria-label="Docs navigation" class="drawer-nav z-1 flex bg-(--page-bg) px-6">
		<div class="nav-scroll-fade relative min-h-0 w-full flex-1 overflow-hidden">
			<NavMenu onNavigate={closeMobileNav} />
		</div>
	</nav>

	<nav aria-label="Docs navigation" class="side-nav bg-(--page-bg)">
		<div class="flex w-full items-center justify-center pt-7 pb-4">
			<Logo />
		</div>

		<div class="nav-scroll-fade relative min-h-0 w-full flex-1 overflow-hidden">
			<NavMenu />
		</div>

		<footer class="flex min-h-18 w-full justify-center no-js:hidden">
			<DarkModeToggle />
		</footer>
	</nav>
</div>

<style>
	.navbar-shell {
		--logo-font-size: clamp(0.75rem, 2.2svh, 1rem);
		--top-nav-logo-mark-size: clamp(2.4375rem, 7.15svh, 3.25rem);
		--top-nav-height: clamp(4rem, 11svh, 5.75rem);
		--top-nav-edge-space: calc((var(--top-nav-height) - var(--top-nav-logo-mark-size)) / 2);
		--nav-transform-duration: 380ms;
		--nav-color-duration: 500ms;
		--nav-visibility-close-delay: var(--nav-transform-duration);
		--nav-ease: ease;

		position: relative;
		z-index: 20;
		min-width: 0;
	}

	.top-nav {
		gap: clamp(1rem, 6svh, 2.5rem);
		height: var(--top-nav-height);
		padding-inline: var(--top-nav-edge-space);
	}

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

	.top-theme-icon {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.top-theme-dark-mode,
	:global(html.dark) .top-theme-light-mode {
		display: none;
	}

	:global(html.dark) .top-theme-dark-mode {
		display: flex;
	}

	.top-theme-icon[data-weight='light'] {
		opacity: 0.3;
	}

	@media (hover: hover) and (pointer: fine) {
		.top-theme-toggle:hover .top-theme-icon[data-weight='light'] {
			opacity: 0;
		}

		.top-theme-toggle:hover .top-theme-icon[data-weight='solid'] {
			opacity: 0.6;
		}
	}

	@media (hover: none) and (pointer: coarse) {
		.top-theme-icon[data-weight='solid'] {
			display: none;
		}
	}

	.drawer-nav {
		--nav-width: 100%;

		flex-direction: column;
		position: absolute;
		width: var(--nav-width);
		top: var(--top-nav-height);
		inset-inline: 0;
		height: calc(100dvh - var(--top-nav-height));
		opacity: 1;
		pointer-events: none;
		transform: translateX(-100%);
		visibility: hidden;
		transition:
			transform var(--nav-transform-duration) var(--nav-ease),
			visibility 0s linear var(--nav-visibility-close-delay),
			background-color var(--nav-color-duration) var(--nav-ease);
	}

	#show-nav:checked ~ .drawer-nav {
		opacity: 1;
		pointer-events: auto;
		transform: translateX(0);
		visibility: visible;
		transition:
			transform var(--nav-transform-duration) var(--nav-ease),
			visibility 0s,
			background-color var(--nav-color-duration) var(--nav-ease);
	}

	.side-nav {
		display: none;
	}

	.nav-scroll-fade {
		--nav-scroll-fade-color: var(--color-white);
	}

	:global(html.dark) .nav-scroll-fade {
		--nav-scroll-fade-color: var(--color-noctis);
	}

	@media (min-width: 600px) {
		.drawer-nav {
			--nav-width: 17.5rem;
		}
	}

	@media (min-width: 800px) {
		.navbar-shell {
			height: 100%;
		}

		.top-nav,
		.drawer-nav {
			display: none;
		}

		.side-nav {
			display: flex;
			flex-direction: column;
			width: 17.5rem;
			min-width: 17.5rem;
			height: 100%;
			justify-content: space-between;
			overflow: hidden;
			padding-inline: 0;
			transition: background-color var(--nav-color-duration) var(--nav-ease);
		}

		.nav-scroll-fade::before,
		.nav-scroll-fade::after {
			content: '';
			pointer-events: none;
			position: absolute;
			inset-inline: 0;
			z-index: 10;
		}

		.nav-scroll-fade::before {
			top: 0;
			height: 34px;
			background: linear-gradient(to bottom, var(--nav-scroll-fade-color), transparent);
		}

		.nav-scroll-fade::after {
			bottom: 0;
			height: 40px;
			background: linear-gradient(to top, var(--nav-scroll-fade-color), transparent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-toggle-label,
		.drawer-nav {
			transition: none;
		}

		.drawer-nav {
			transform: none;
		}
	}
</style>
