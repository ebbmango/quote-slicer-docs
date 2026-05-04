<script lang="ts">
	import Fa from 'svelte-fa';
	import { faBook, faMoon, faSunBright } from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';
	import Logo from './Logo.svelte';
	import { theme } from '$lib/theme';
	import { articleTree } from '$lib/navigation/articleTree';

	let icon = $derived(theme.current === 'dark' ? faMoon : faSunBright);

	const toggle = () => {
		const nextMode = theme.current === 'dark' ? 'light' : 'dark';
		theme.current = nextMode;
	};
</script>

<div class="top-nav-shell">
	<nav class="top-nav sticky top-0 flex h-23 w-full items-center justify-between gap-18 px-5">
		<!-- open navigation sidebar -->
		<Logo />
		<!-- open chapters sidebar -->
		<div class="flex items-center justify-between gap-4 pe-2 text-xl opacity-70">
			<button>
				<Fa icon={faBook}></Fa>
			</button>
			<button onclick={toggle} class="size-5">
				<Fa {icon}></Fa>
			</button>
		</div>
	</nav>

	<!-- <div class="top-nav-modal z-1 flex flex-col bg-amber-100">
		{#each articleTree as node (node.title)}
		
		{/each}
	</div> -->
</div>
