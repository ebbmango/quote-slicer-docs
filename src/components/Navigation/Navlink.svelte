<script lang="ts">
	import { resolve } from '$app/paths';

	const { article } = $props();
</script>

<a
	href={resolve(article.path)}
	class="ui-link-transition mb-7 block font-inter text-[14px] font-medium hover:translate-x-2 hover:text-(--acc)"
>
	{article.title.toUpperCase()}
</a>
