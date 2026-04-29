<script lang="ts">
	import '../lib/styles/index.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '../components/Navbar.svelte';
	import { theme } from '$lib/theme';

	const MIN_LAYOUT_WIDTH = 320;
	const MIN_LAYOUT_HEIGHT = 455;

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

<div
	class="flex h-dvh w-full"
	style="min-width: {MIN_LAYOUT_WIDTH}px; min-height: {MIN_LAYOUT_HEIGHT}px;"
>
	<Navbar />

	{@render children()}
</div>
