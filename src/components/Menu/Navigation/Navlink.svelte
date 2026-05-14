<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/navigation/articleTypes';
	import { faArrowRight } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';
	import Fa from 'svelte-fa';

	type Props = {
		article: Article;
		onNavigate?: () => void;
	};

	const { article, onNavigate }: Props = $props();
	let title = $derived(article.title);

	function handleNavigate() {
		onNavigate?.();
	}
</script>

<a
	href={resolve(article.path)}
	onclick={handleNavigate}
	class="nav-link focus-ring-none group relative flex items-center justify-between opacity-60"
>
	<span class="nav-link-label nav-header">
		{title}
	</span>
	<span class="nav-link-icon" aria-hidden="true">
		<Fa icon={faArrowRight} />
	</span>
</a>

<style>
	.nav-link-label {
		transition: transform 500ms ease;
	}

	.nav-link-icon {
		display: flex;
		opacity: 0;
		transition:
			opacity 500ms ease,
			transform 500ms ease;
	}

	@media (hover: hover) and (pointer: fine) {
		.nav-link:is(:hover, :focus-visible) .nav-link-icon {
			opacity: 0.7;
		}
	}

	@media (hover: none) and (pointer: coarse) {
		.nav-link-icon {
			opacity: 0.2;
			transition: none;
		}
	}

	@media (max-width: 599.98px) {
		.nav-link {
			justify-content: center;
		}

		.nav-link-icon {
			position: absolute;
			right: -1.5rem;
		}
	}

	@media (max-width: 599.98px) and (hover: hover) and (pointer: fine) {
		.nav-link:is(:hover, :focus-visible) .nav-link-icon {
			transform: translateX(0.25rem);
		}
	}

	@media (min-width: 600px) {
		.nav-link {
			width: 100%;
		}
	}

	@media (min-width: 600px) and (hover: hover) and (pointer: fine) {
		.nav-link:is(:hover, :focus-visible) .nav-link-label {
			transform: translateX(0.5rem);
		}
	}
</style>
