<script lang="ts">
	import '../lib/styles/index.css';
	import { theme } from '$lib/theme';
	import faviconBlack from '$lib/assets/favicon-black.svg';
	import faviconWhite from '$lib/assets/favicon-white.svg';

	import Navbar from '../components/Menu/Navbar.svelte';

	let { children } = $props();
	let favicon = $derived(theme.current === 'dark' ? faviconWhite : faviconBlack);
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
		grid-template-areas:
			'nav'
			'page';
		grid-template-columns: minmax(0, 1fr);
	}

	.app-page {
		grid-area: page;
		display: flex;
		min-width: 0;
	}

	.app-shell :global(.navbar-shell) {
		grid-area: nav;
	}

	.app-page :global(.contents-sidebar) {
		display: none;
	}

	@media (min-width: 800px) {
		.app-shell {
			grid-template-areas: 'nav page';
			grid-template-columns: auto minmax(0, 1fr);
		}
	}

	@media (min-width: 1200px) {
		.app-page :global(.contents-sidebar) {
			display: flex;
		}
	}
</style>
