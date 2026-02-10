<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMoon, faSunBright } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import { getContext } from 'svelte';
	import type { ThemeContext } from '$lib/types';

	const theme = getContext<ThemeContext>('theme');

	const toggle = () => {
		theme.current = theme.current === 'dark' ? 'light' : 'dark';
	};
</script>

<div
	class="group bg-gray-10 absolute -bottom-9 flex min-h-20 w-10 flex-col items-center justify-between rounded-full duration-500 dark:rotate-180"
>
	<button
		onclick={toggle}
		class="duration-500 group-hover:-translate-y-0.5 group-hover:scale-115 dark:-rotate-180"
	>
		<Fa icon={faSunBright} class="text-2xl text-amber-500" />
	</button>
	<button
		onclick={toggle}
		class="duration-500 group-hover:translate-y-0.5 group-hover:scale-115 dark:-rotate-180"
	>
		<Fa icon={faMoon} class="text-xl text-gray-400" />
	</button>
</div>
