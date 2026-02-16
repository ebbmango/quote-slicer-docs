<script lang="ts">
	const { slug, title } = $props();
</script>

<a
	href={slug}
	class="ui-link-transition block w-full hover:translate-x-1 hover:text-(--acc)"
>
	{title}
</a>
