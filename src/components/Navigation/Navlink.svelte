<script lang="ts">
	const { article } = $props();
</script>

<a
	href={article.path}
	class="ui-link-transition mb-7 block font-inter text-[14px] font-medium hover:translate-x-2 hover:text-(--acc)"
>
	{article.title.toUpperCase()}
</a>
