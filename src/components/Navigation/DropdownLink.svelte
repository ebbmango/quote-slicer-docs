<script lang="ts">
	const { path, title } = $props();
</script>

<a href={path} class="ui-link-transition block w-full hover:translate-x-1 hover:text-(--acc)">
	{title}
</a>
