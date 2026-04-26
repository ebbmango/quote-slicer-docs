<script lang="ts">
	import { resolve } from '$app/paths';

	const { article } = $props();
</script>

<a
	href={resolve(article.path)}
	class="mb-7 block font-mono font-light opacity-40 duration-500 hover:translate-x-2 hover:text-(--acc) hover:opacity-100"
>
	{article.title.toUpperCase()}
</a>
