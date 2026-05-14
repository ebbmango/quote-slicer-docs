<script lang="ts">
	import '../lib/styles/index.css';
	import { theme } from '$lib/theme';
	import faviconBlack from '$lib/assets/favicon-black.svg';
	import faviconWhite from '$lib/assets/favicon-white.svg';

	import Navbar from '../components/Menu/Navbar.svelte';

	let { children } = $props();
	let favicon = $derived(theme.current === 'dark' ? faviconWhite : faviconBlack);

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

<div class="app-shell">
	<Navbar />
	<div class="app-page">
		{@render children()}
	</div>
</div>

<style>
	.app-shell {
		display: grid;
		align-content: start;
		min-height: 100dvh;
		width: 100%;
		grid-template:
			'top-nav' auto
			'page' auto / minmax(0, 1fr);
	}

	.app-page {
		grid-area: page;
		display: flex;
		min-width: 0;
	}

	.app-shell :global(.navbar-shell) {
		grid-area: top-nav;
	}

	.app-page :global(.contents-sidebar) {
		display: none;
	}

	@media (min-width: 800px) {
		.app-shell {
			grid-template:
				'side-nav page' minmax(100dvh, auto)
				/ auto minmax(0, 1fr);
		}

		.app-shell :global(.navbar-shell) {
			grid-area: side-nav;
		}
	}

	@media (min-width: 1200px) {
		.app-page :global(.contents-sidebar) {
			display: flex;
		}
	}
</style>
