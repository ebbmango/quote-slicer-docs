<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string;
		active?: boolean;
		delay?: number;
		duration?: number;
		fillColor?: string;
		activeTextColor?: string;
		inactiveTextColor?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		text = '',
		active = false,
		delay = 300,
		duration = 300,
		fillColor = '#ff0037',
		activeTextColor = '#ffffff',
		inactiveTextColor = '#000000',
		class: className = '',
		children
	}: Props = $props();

	let displayedActive = $state(delay <= 0 ? active : false);
	let activationTimer: ReturnType<typeof setTimeout> | null = null;

	function clearActivationTimer() {
		if (!activationTimer) return;

		clearTimeout(activationTimer);
		activationTimer = null;
	}

	$effect(() => {
		clearActivationTimer();

		if (active) {
			if (delay <= 0) {
				displayedActive = true;
			} else {
				activationTimer = setTimeout(() => {
					displayedActive = true;
					activationTimer = null;
				}, delay);
			}
		} else {
			displayedActive = false;
		}

		return () => {
			clearActivationTimer();
		};
	});
</script>

<span
	class={`highlight-back ${displayedActive ? 'active' : ''}`}
	style={`--highlight-duration: ${duration}ms; --highlight-fill: ${fillColor}; --highlight-text-active: ${activeTextColor}; --highlight-text-inactive: ${inactiveTextColor};`}
>
	<span class={`highlight-word ${className}`}>
		{#if text}
			{text}
		{:else if children}
			{@render children()}
		{:else}
			&nbsp;
		{/if}
	</span>
</span>

<style>
	.highlight-back {
		display: inline-block;
		margin-inline: -3px;
		background-image: linear-gradient(
			to right,
			var(--highlight-fill) 50%,
			var(--highlight-fill) 50%
		);
		background-repeat: no-repeat;
		background-size: 0 100%;
		transition: background-size var(--highlight-duration) ease;
	}

	.highlight-word {
		display: inline-block;
		padding: 3px;
		color: transparent;
		background-image: linear-gradient(
			to right,
			var(--highlight-text-active) 50%,
			var(--highlight-text-inactive) 50%
		);
		background-position: 100% 0;
		background-repeat: no-repeat;
		background-size: 200% 100%;
		background-clip: text;
		-webkit-background-clip: text;
		transition: background-position var(--highlight-duration) ease;
	}

	.highlight-back.active {
		background-size: 100% 100%;
	}

	.highlight-back.active .highlight-word {
		background-position: 0 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.highlight-back,
		.highlight-word {
			transition-duration: 0ms;
		}
	}
</style>
