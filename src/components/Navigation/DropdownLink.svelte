<script lang="ts">
	const { slug, title } = $props();
</script>

<a
	href={slug}
	class="w-full duration-250 hover:ps-1 hover:text-(--acc)"
>
	{title}
</a>
