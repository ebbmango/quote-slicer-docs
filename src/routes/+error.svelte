<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">{page.status}</h1>
	<p class="mt-4 text-lg">{page.error?.message || 'Something went wrong'}</p>
	<a href="{base}/" class="mt-6 text-blue-600 hover:underline dark:text-blue-400">← Back to home</a>
</div>
