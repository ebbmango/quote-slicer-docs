<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Page Not Found</title>
</svelte:head>

<div class="flex h-full w-full flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">404</h1>
	<p class="mt-4 text-lg">Page not found</p>
	<a href="{base}/" class="mt-6 text-blue-600 hover:underline dark:text-blue-400">← Back to home</a>
</div>
