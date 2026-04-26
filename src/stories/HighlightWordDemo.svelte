<script lang="ts">
	import HighlightWord from '../components/HighlightWord.svelte';

	interface Props {
		text?: string;
		delay?: number;
		duration?: number;
	}

	let { text = 'reactive', delay = 300, duration = 300 }: Props = $props();

	let active = $state(false);
</script>

<div class="demo">
	<div class="controls">
		<button type="button" onclick={() => (active = !active)}>
			{active ? 'Deactivate' : 'Activate'}
		</button>
		<button
			type="button"
			onpointerenter={() => (active = true)}
			onpointerleave={() => (active = false)}
		>
			Hover trigger
		</button>
	</div>

	<p class="copy">
		This
		<HighlightWord {active} {delay} {duration}>
			{text}
		</HighlightWord>
		word can be driven by any external state.
	</p>
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		font-family: 'Iosevka Aile', 'IBM Plex Sans', sans-serif;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	button {
		border: 1px solid rgb(15 23 42 / 0.16);
		background: white;
		padding: 0.5rem 0.75rem;
		font: inherit;
		cursor: pointer;
	}

	.copy {
		margin: 0;
		font-size: 1.125rem;
		line-height: 1.8;
		color: rgb(15 23 42);
	}
</style>
