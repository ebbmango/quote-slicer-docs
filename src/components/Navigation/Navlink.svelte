<script lang="ts">
	const { section } = $props();
</script>

<a
	href={section.slug}
	class="ui-link-transition font-inter mb-7 block text-[14px] font-medium hover:translate-x-2 hover:text-(--acc)"
>
	{section.title.toUpperCase()}
</a>
