<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/navigation/articleTypes';

	type Props = {
		article: Article;
	};

	const { article }: Props = $props();
	let title = $derived(article.title);
</script>

<a
	href={resolve(article.path)}
	class="nav-header block duration-500 focus-visible:outline-none js-only:hocus:translate-x-2"
>
	{title}
</a>
