<script lang="ts">
	const { section, color } = $props();
	let hover = $state(false);
	$inspect(color);
</script>

<a
	href={section.slug}
	class="font-inter text-[14px] font-medium duration-300 hover:ms-2"
	onmouseenter={() => (hover = true)}
	onmouseleave={() => (hover = false)}
	style:color={hover ? color : undefined}
>
	{section.title.toUpperCase()}
</a>
