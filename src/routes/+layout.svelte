<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex w-full h-dvh">
	<!-- sidebar --- docs - topics -->
	<div class="flex w-90 h-dvh bg-gray-300"></div>
	{@render children()}
	<!-- sidebar --- page chapters -->
	<div class="flex w-90 h-dvh bg-gray-300"></div>

</div>

