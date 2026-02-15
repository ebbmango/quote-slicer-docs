<script lang="ts">
	const { slug, title } = $props();
</script>

<a
	href={slug}
	class="block w-full transition-settings hover:translate-x-1 hover:text-(--acc)"
>
	{title}
</a>

