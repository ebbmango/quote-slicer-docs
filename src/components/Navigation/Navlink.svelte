<script lang="ts">
	import { resolve } from '$app/paths';

	const { article } = $props();
	let title = $derived(article.title);
</script>

<a
	href={resolve(article.path)}
	class="nav-header block duration-500 focus-visible:outline-none js-only:hocus:translate-x-2"
>
	{title}
</a>
