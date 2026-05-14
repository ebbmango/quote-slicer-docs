<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Section } from '$lib/navigation/articleTypes';

	type Props = {
		section: Section;
		onNavigate?: () => void;
	};

	const { section, onNavigate }: Props = $props();
	let title = $derived(section.title);

	function handleNavigate() {
		onNavigate?.();
	}
</script>

<section class="nav-section">
	<div class="nav-section-label">
		<span class="nav-section-title nav-header opacity-60">
			{title}
		</span>
	</div>
	<div class="nav-section-list-frame">
		<ul class="nav-section-list">
			{#each section.children as navlink (navlink.path)}
				<li class="nav-section-item acc-{navlink.nestedIndex % 9}">
					<a
						class="nav-section-link focus-ring-none touch:hocus:translate-x-1"
						href={resolve(navlink.path)}
						onclick={handleNavigate}>{navlink.title}</a
					>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.nav-section {
		--nav-section-link-hover-opacity: 0.9;
		--nav-section-touch-link-opacity: 0.8;
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(html.dark) .nav-section {
		--nav-section-link-hover-opacity: 1;
		--nav-section-touch-link-opacity: 1;
	}

	.nav-section-label,
	.nav-section-list-frame {
		width: 100%;
	}

	.nav-section-label {
		display: flex;
		align-items: center;
	}

	.nav-section-list {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-inter);
		font-weight: 250;
	}

	.nav-section-item {
		width: 100%;
	}

	.nav-section-link {
		display: inline-block;
		transition:
			color 500ms ease,
			opacity 500ms ease,
			padding-inline-start 500ms ease,
			transform 500ms ease,
			translate 500ms ease;
	}

	@media (hover: none) and (pointer: coarse) {
		.nav-section-link {
			width: auto;
			color: var(--acc);
			opacity: var(--nav-section-touch-link-opacity);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.nav-section-link {
			display: flex;
			width: 100%;
			opacity: 30%;
		}

		.nav-section-link:is(:hover, :focus-visible) {
			color: var(--acc);
			opacity: var(--nav-section-link-hover-opacity);
		}
	}

	@media (max-width: 599.98px) {
		.nav-section {
			align-items: center;
		}

		.nav-section-label {
			justify-content: center;
		}

		.nav-section-list {
			align-items: center;
			justify-content: center;
		}

		.nav-section-item {
			display: flex;
			justify-content: center;
		}
	}

	@media (max-width: 599.98px) and (hover: hover) and (pointer: fine) {
		.nav-section-link {
			justify-content: center;
		}
	}

	@media (min-width: 600px) and (hover: hover) and (pointer: fine) {
		.nav-section-link:is(:hover, :focus-visible) {
			padding-inline-start: 0.25rem;
		}
	}
</style>
