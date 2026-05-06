<script lang="ts">
	import '../lib/styles/index.css';
	import { theme } from '$lib/theme';
	import favicon from '$lib/assets/favicon.svg';

	import NavbarY from '../components/NavbarY.svelte';
	import NavbarX from '../components/NavbarX.svelte';

	let { children } = $props();

	$effect(() => {
		if (typeof document === 'undefined') return;
		const isDark = theme.current === 'dark';
		document.documentElement.classList.toggle('dark', isDark);
		document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window />

<!-- The layout, at first, should be simple: just the navbar and the page's contents. -->
<!-- As the sidebar belongs only to article pages, it should comprise another layout. -->

<div class="app-shell">
	<div id="x-nav"><NavbarX /></div>
	<div id="y-nav"><NavbarY /></div>
	<div class="app-page">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		display: grid;
		height: 100dvh;
		width: 100%;
		grid-template:
			'top-nav' auto
			'page' minmax(0, 1fr) / minmax(0, 1fr);
	}

	.app-page {
		grid-area: page;
		display: flex;
		min-width: 0;
		min-height: 0;
	}

	#x-nav {
		position: relative;
		z-index: 20;
		grid-area: top-nav;
		min-width: 0;
	}

	#y-nav {
		grid-area: side-nav;
		display: none;
		min-height: 0;
	}

	#y-nav > :global(.side-nav) {
		height: 100%;
	}

	.app-page :global(.contents-sidebar) {
		display: none;
	}

	@media (min-width: 800px) {
		.app-shell {
			grid-template:
				'side-nav page' minmax(0, 1fr)
				/ auto minmax(0, 1fr);
		}

		#x-nav {
			display: none;
		}

		#y-nav {
			display: block;
		}
	}

	@media (min-width: 1200px) {
		.app-page :global(.contents-sidebar) {
			display: flex;
		}
	}
</style>
