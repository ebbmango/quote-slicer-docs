<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/navigation/articleTypes';
	import { faArrowRight } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';
	import Fa from 'svelte-fa';

	type Props = {
		article: Article;
	};

	const { article }: Props = $props();
	let title = $derived(article.title);
</script>

<a
	href={resolve(article.path)}
	class="group mb-7 flex items-center justify-between focus-visible:outline-none"
>
	<span class="nav-header duration-500 js-only:group-hocus:translate-x-2">
		{title}
	</span>
	<Fa
		class="mr-1.5 opacity-0 duration-500 js-only:group-hocus:opacity-30 no-js:group-hocus:opacity-20"
		icon={faArrowRight}
	/>
</a>
