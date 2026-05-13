<script lang="ts">
	import { articleTree } from '$lib/navigation/articleTree';
	import { diaryNavItem } from '$lib/navigation/articleLookup';
	import { isSection } from '$lib/navigation/articleTypes';
	import Navlink from './Navlink.svelte';
	import NavSection from './NavSection.svelte';

	type Props = {
		onNavigate?: () => void;
	};

	const { onNavigate }: Props = $props();
</script>

<ul class="nav-menu hidebar">
	{#each articleTree as node (node.title)}
		<li>
			{#if isSection(node)}
				<NavSection section={node} {onNavigate} />
			{:else}
				<Navlink article={node} {onNavigate} />
			{/if}
		</li>
	{/each}
	<li>
		<Navlink article={diaryNavItem} {onNavigate} />
	</li>
</ul>

<style>
	.nav-menu {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		overflow: scroll;
	}

	.nav-menu {
		gap: 1.25rem;
		padding-block: 0.75rem 2rem;
		scroll-padding-block: 0.75rem 2rem;
	}

	.nav-menu > :first-child {
		margin-block-start: auto;
	}

	.nav-menu > :last-child {
		margin-block-end: auto;
	}

	@media (max-width: 599.98px) {
		.nav-menu {
			align-items: center;
		}
	}

	@media (min-width: 800px) {
		.nav-menu {
			padding-block-start: 1.5rem;
			padding-inline-start: 1rem;
			white-space: nowrap;
		}
	}
</style>
