<script lang="ts">
	const { slug, title } = $props();
</script>

<a
	href={slug}
	class="block w-full transition-[color,translate] duration-400 hover:translate-x-1 hover:text-(--acc)"
>
	{title}
</a>
