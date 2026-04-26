<script lang="ts">
	import { resolve } from '$app/paths';

	const { path, title } = $props();
</script>

<a
	href={resolve(path)}
	class="block w-full opacity-40 duration-500 hover:translate-x-1 hover:text-(--acc) hover:opacity-100"
>
	{title}
</a>
