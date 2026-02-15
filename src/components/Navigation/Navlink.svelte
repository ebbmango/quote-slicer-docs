<script lang="ts">
	const { section } = $props();
</script>

<a
	href={section.slug}
	class="font-inter block text-[14px] font-medium duration-300 hover:ms-2 hover:text-(--acc) mb-7"
>
	{section.title.toUpperCase()}
</a>
