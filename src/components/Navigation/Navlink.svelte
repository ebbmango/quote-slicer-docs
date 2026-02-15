<script lang="ts">
	const { section } = $props();
</script>

<a
	href={section.slug}
	class="font-inter block text-[14px] font-medium transition-settings hover:translate-x-2 hover:text-(--acc) mb-7"
>
	{section.title.toUpperCase()}
</a>

