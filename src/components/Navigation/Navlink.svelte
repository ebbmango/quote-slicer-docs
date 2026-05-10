<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/navigation/articleTypes';
	import { faArrowRight } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';
	import Fa from 'svelte-fa';

	type Props = {
		article: Article;
		onNavigate?: () => void;
	};

	const { article, onNavigate }: Props = $props();
	let title = $derived(article.title);

	function handleNavigate() {
		onNavigate?.();
	}
</script>

<a
	href={resolve(article.path)}
	onclick={handleNavigate}
	class="focus-ring-none group relative flex items-center justify-between opacity-60 max-[600px]:justify-center min-[600px]:w-full"
>
	<span class="nav-header duration-500 min-[600px]:group-hocus:translate-x-2">
		{title}
	</span>
	<Fa
		class="-right-6 opacity-0 duration-500 group-hocus:opacity-70 max-[600px]:absolute max-[600px]:group-hocus:translate-x-1 touch:opacity-20"
		icon={faArrowRight}
	/>
</a>
