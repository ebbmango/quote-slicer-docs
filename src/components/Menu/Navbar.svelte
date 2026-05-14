<script lang="ts">
	import { theme } from '$lib/theme';
	import Logo from './Logo.svelte';
	import NavMenu from './Navigation/NavMenu.svelte';
	import ThemeToggle from './Buttons/ThemeToggle.svelte';
	import NavbarToggle from './Buttons/NavbarToggle.svelte';
	import AnimatedThemeToggle from './Buttons/AnimatedThemeToggle.svelte';

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
	<header class="top-nav">
		<div class="top-nav-logo-frame">
			<Logo />
		</div>
		<div class="top-nav-controls">
			<div class="top-nav-toggle-frame">
				<NavbarToggle id="show-nav" bind:checked />
			</div>
			<ThemeToggle {toggle} />
		</div>
	</header>

	<nav aria-label="Docs navigation" class="drawer-nav">
		<div class="nav-scroll-fade">
			<NavMenu onNavigate={closeMobileNav} />
		</div>
	</nav>

	<nav aria-label="Docs navigation" class="side-nav">
		<div class="side-nav-logo-frame">
			<Logo />
		</div>

		<div class="nav-scroll-fade">
			<NavMenu />
		</div>

		<footer class="side-nav-footer">
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
		--logo-font-size: clamp(0.75rem, calc(0.6rem + 0.8vw), 1rem);

		position: sticky;
		top: 0;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
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

	.top-nav-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-size: 1.25rem;
		line-height: 1.75rem;
	}

	.top-nav-toggle-frame {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-scroll-fade {
		position: relative;
		min-height: 0;
		width: 100%;
		flex: 1 1 0%;
		overflow: hidden;
	}

	@supports (width: 1cqw) {
		.navbar-shell {
			container-type: inline-size;
			--top-nav-height: clamp(4rem, calc(2.8rem + 5.8cqw), 5.75rem);
			--top-nav-gap: clamp(1rem, 5cqw, 2.5rem);
		}

		.top-nav {
			--logo-font-size: clamp(0.75rem, calc(0.6rem + 0.8cqw), 1rem);
		}
	}

	.drawer-nav {
		position: absolute;
		top: var(--top-nav-height);
		inset-inline: 0;
		z-index: 1;
		display: flex;
		width: var(--drawer-nav-width);
		flex-direction: column;
		padding-inline: 1.5rem;
		height: calc(100dvh - var(--top-nav-height));
		background-color: var(--page-bg);
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
		background-color: var(--page-bg);
	}

	.side-nav-logo-frame {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		padding-block: 1.75rem 1rem;
	}

	.side-nav-footer {
		position: relative;
		display: flex;
		width: 100%;
		min-height: 4.5rem;
		justify-content: center;
		overflow: hidden;
	}

	:global(html.no-js) .side-nav-footer {
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
