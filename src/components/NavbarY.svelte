<script lang="ts">
	import { docsStructure } from '$lib/constants/docs-structure';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import Dropdown from './Navigation/NavbarDropdown.svelte';
	import Navlink from './Navigation/Navlink.svelte';
	import Logo from './Logo.svelte';
	import { resolve } from '$app/paths';

	type Props = { width: number };

	let { width }: Props = $props();

	const sections = docsStructure;
</script>

<nav
	aria-label="Docs navigation"
	class="h-vh relative flex w-70 flex-col justify-center overflow-hidden bg-gray-50 duration-400 dark:bg-noctis dark:text-gray-300"
	style="width: {width}px; min-width: {width}px; flex: 0 0 auto; overflow: hidden;"
>
	<a href={resolve('/')} class="absolute top-0 mt-6 flex w-full justify-center">
		<Logo />
	</a>

	<section aria-label="Articles" class="hide-bar relative mt-16 w-full -translate-y-8 overflow-scroll px-7 py-24">
		<ul
			class="acc-cycle hide-bar flex h-full w-full flex-col overflow-scroll overflow-x-hidden text-nowrap"
		>
			{#each sections as section, i}
				<li>
					{#if section.children}
						<Dropdown {section} />
					{:else}
						<Navlink {section} />
					{/if}
				</li>
			{/each}
		</ul>
	</section>
	<footer class="absolute bottom-0 flex h-20 w-full justify-center">
		<DarkModeToggle />
	</footer>
</nav>
