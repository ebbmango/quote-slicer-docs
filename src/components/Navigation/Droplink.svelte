<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/navigation/articleTypes';

	type Props = Pick<Article, 'path' | 'title'> & {
		visible?: boolean;
	};

	const { path, title, visible = true }: Props = $props();
</script>

<a
	href={resolve(path)}
	tabindex={visible ? 0 : -1}
	class="text-md block w-full font-light opacity-30 duration-500 focus-visible:outline-none hocus:translate-x-1 hocus:text-(--acc) hocus:opacity-80"
>
	{title}
</a>
