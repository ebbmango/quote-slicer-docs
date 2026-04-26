<script lang="ts">
	import { resolve } from '$app/paths';

	const { path, title } = $props();
</script>

<a href={resolve(path)} class="ui-link-transition block w-full hover:translate-x-1 hover:text-(--acc)">
	{title}
</a>
