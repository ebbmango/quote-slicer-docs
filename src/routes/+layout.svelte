<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '../components/Sidebar.svelte';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex w-full h-dvh">
	<!-- sidebar --- docs - topics -->
	<Sidebar/>

	<main class="flex flex-col w-full items-center">
		<article class="prose dark:prose-invert mt-12">
			{@render children()}
		</article>
	</main>
	<!-- sidebar --- page chapters -->
	<div class="flex min-w-70 h-dvh bg-gray-300"></div>
</div>

