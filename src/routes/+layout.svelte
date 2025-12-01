<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '../components/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-dvh w-full">
	<!-- sidebar --- docs - topics -->
	<Sidebar />

	<main class="flex w-full flex-col items-center dark:bg-umbra">
		<article class="prose h-full w-full sm:px-8 dark:prose-invert">
			{@render children()}
		</article>
	</main>
	<!-- sidebar --- page chapters -->
	<div class="flex h-dvh min-w-70 bg-gray-300 dark:bg-umbra"></div>
</div>
