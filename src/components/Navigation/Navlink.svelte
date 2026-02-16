<script lang="ts">
	const { section } = $props();
</script>

<a
	href={section.slug}
	class="font-inter mb-7 block text-[14px] font-medium transition-[color,translate] duration-400 hover:translate-x-2 hover:text-(--acc)"
>
	{section.title.toUpperCase()}
</a>
