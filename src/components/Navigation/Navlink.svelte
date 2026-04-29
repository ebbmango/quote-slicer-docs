<script lang="ts">
	import { resolve } from '$app/paths';

	const { article } = $props();
	let title = $derived(article.title);
</script>

<a
	href={resolve(article.path)}
	class="nav-header mb-7 block opacity-60 duration-500 focus-visible:outline-none hocus:translate-x-2 hocus:text-(--acc) hocus:opacity-100"
>
	{title}
</a>
