<script lang="ts">
	import Logo from './Logo.svelte';
	import Navlink from './Navigation/Navlink.svelte';
	import Dropdown from './Navigation/Dropdown.svelte';
	import DarkModeToggle from './DarkModeToggle.svelte';
	import { isSection } from '$lib/navigation/articleTypes';
	import { articleTree } from '$lib/navigation/articleTree';
	import { diaryNavItem } from '$lib/navigation/articleLookup';
</script>

<nav
	aria-label="Docs navigation"
	class="side-nav relative flex min-w-70 flex-col justify-between overflow-hidden no-js:mb-18"
>
	<div class="flex w-full items-center justify-center pt-7 pb-4">
		<Logo />
	</div>

	<!-- TODO/fix: Sometimes it's not obvious when there are more elements apart from those -->
	<!-- immediately visible in the scroll container. -->

	<div class="nav-scroll-fade relative min-h-0 w-full flex-1 overflow-hidden">
		<ul
			class="nav-scroll-list hidebar flex h-full w-full flex-col overflow-scroll ps-6 pt-6 text-nowrap"
		>
			{#each articleTree as node (node.title)}
				<li>
					{#if isSection(node)}
						<Dropdown section={node} />
					{:else}
						<Navlink article={node} />
					{/if}
				</li>
			{/each}
			<li>
				<Navlink article={diaryNavItem} />
			</li>
		</ul>
	</div>

	<footer class="flex min-h-18 w-full justify-center no-js:hidden">
		<DarkModeToggle />
	</footer>
</nav>

<style>
	.nav-scroll-fade {
		--nav-scroll-fade-color: var(--color-white);
	}

	:global(html.dark) .nav-scroll-fade {
		--nav-scroll-fade-color: var(--color-noctis);
	}

	.nav-scroll-fade::before,
	.nav-scroll-fade::after {
		content: '';
		pointer-events: none;
		position: absolute;
		inset-inline: 0;
		z-index: 10;
	}

	.nav-scroll-fade::before {
		top: 0;
		height: 34px;
		background: linear-gradient(to bottom, var(--nav-scroll-fade-color), transparent);
	}

	.nav-scroll-fade::after {
		bottom: 0;
		height: 40px;
		background: linear-gradient(to top, var(--nav-scroll-fade-color), transparent);
	}

	/* These fix unreachable items on justified scroll view */

	.nav-scroll-list > :first-child {
		margin-top: auto;
	}

	.nav-scroll-list > :last-child {
		margin-bottom: auto;
	}
</style>
