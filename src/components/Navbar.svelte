<script lang="ts">
	import { theme } from '$lib/theme';
	import Logo from './Logo.svelte';
	import NavMenu from './Navigation/NavMenu.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import NavbarToggle from './NavbarToggle.svelte';
	import AnimatedThemeToggle from './AnimatedThemeToggle.svelte';

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
	<header class="top-nav sticky top-0 flex w-full items-center justify-between">
		<div class="top-nav-logo-frame">
			<Logo />
		</div>
		<div class="top-nav-controls flex items-center justify-between gap-4 text-xl">
			<div class="relative flex items-center justify-center">
				<NavbarToggle id="show-nav" bind:checked />
			</div>
			<ThemeToggle {toggle} />
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

		<footer class="relative flex min-h-18 w-full justify-center overflow-hidden no-js:hidden">
			<AnimatedThemeToggle />
		</footer>
	</nav>
</div>

<style>
	.navbar-shell {
		--drawer-nav-width: 100%;
		--top-nav-height: clamp(4rem, calc(3rem + 6vw), 5.75rem);
		--top-nav-edge-space: 0.25rem;
		--top-nav-gap: clamp(1rem, 5vw, 2.5rem);
		--nav-transform-duration: 380ms;
		--nav-color-duration: 500ms;
		--nav-visibility-close-delay: var(--nav-transform-duration);
		--nav-ease: ease;

		position: sticky;
		top: 0;
		z-index: 20;
		min-width: 0;
	}

	.top-nav {
		--logo-font-size: clamp(0.75rem, calc(0.583333rem + 0.833333vw), 1rem);

		gap: var(--top-nav-gap);
		height: var(--top-nav-height);
		padding-inline: calc(var(--top-nav-edge-space) + var(--page-edge-gutter));
		background-color: var(--page-bg);
		transition: background-color var(--nav-color-duration) var(--nav-ease);
	}

	.top-nav-logo-frame {
		display: flex;
		flex: none;
		transition: transform var(--nav-transform-duration) var(--nav-ease);
	}

	@supports (width: 1cqw) {
		.navbar-shell {
			container-type: inline-size;
			--top-nav-height: clamp(4rem, calc(2.833333rem + 5.833333cqw), 5.75rem);
			--top-nav-gap: clamp(1rem, 5cqw, 2.5rem);
		}

		.top-nav {
			--logo-font-size: clamp(0.75rem, calc(0.583333rem + 0.833333cqw), 1rem);
		}
	}

	.drawer-nav {
		flex-direction: column;
		position: absolute;
		width: var(--drawer-nav-width);
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

	.navbar-shell:has(:global(#show-nav:checked)) .drawer-nav {
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

	@media (min-width: 600px) {
		.navbar-shell {
			--drawer-nav-width: 17.5rem;
		}

		.navbar-shell:has(:global(#show-nav:checked)) .top-nav-logo-frame {
			transform: translateX(
				calc(
					var(--drawer-nav-width) / 2 - var(--top-nav-edge-space) - var(--page-edge-gutter) - 50%
				)
			);
		}
	}

	@media (min-width: 800px) {
		.navbar-shell {
			container-type: normal;
			align-self: start;
			height: 100dvh;
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
			height: 100dvh;
			min-height: 300px;
			justify-content: space-between;
			overflow: hidden;
			padding-inline: var(--page-edge-gutter) 0;
			transition: background-color var(--nav-color-duration) var(--nav-ease);
		}

		.nav-scroll-fade::before,
		.nav-scroll-fade::after {
			content: '';
			pointer-events: none;
			position: absolute;
			inset-inline: 0;
			z-index: 10;
			background-color: var(--page-bg);
			transition: background-color var(--nav-color-duration) var(--nav-ease);
		}

		.nav-scroll-fade::before {
			top: 0;
			height: 34px;
			-webkit-mask-image: linear-gradient(to bottom, black, transparent);
			mask-image: linear-gradient(to bottom, black, transparent);
		}

		.nav-scroll-fade::after {
			bottom: 0;
			height: 40px;
			-webkit-mask-image: linear-gradient(to top, black, transparent);
			mask-image: linear-gradient(to top, black, transparent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.top-nav-logo-frame,
		.drawer-nav {
			transition: none;
		}

		.drawer-nav {
			transform: none;
		}

		.nav-scroll-fade::before,
		.nav-scroll-fade::after {
			transition: none;
		}
	}
</style>
