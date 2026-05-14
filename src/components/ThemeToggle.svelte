<script lang="ts">
	import {
		faMoon as moonSolid,
		faSunBright as sunSolid
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';

	import {
		faMoon as moonLight,
		faSunBright as sunLight
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';
	import Fa from 'svelte-fa';

	const { toggle } = $props();
</script>

<button
	onclick={toggle}
	class="top-theme-toggle focus-ring-none group relative flex size-5 no-js:hidden"
>
	<span class="top-theme-icon top-theme-light-mode" data-weight="light">
		<Fa icon={sunLight} />
	</span>
	<span class="top-theme-icon top-theme-light-mode" data-weight="solid">
		<Fa icon={sunSolid} />
	</span>
	<span class="top-theme-icon top-theme-dark-mode" data-weight="light">
		<Fa icon={moonLight} />
	</span>
	<span class="top-theme-icon top-theme-dark-mode" data-weight="solid">
		<Fa icon={moonSolid} />
	</span>
</button>

<style>
	.top-theme-icon {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.top-theme-dark-mode,
	:global(html.dark) .top-theme-light-mode {
		display: none;
	}

	:global(html.dark) .top-theme-dark-mode {
		display: flex;
	}

	.top-theme-icon[data-weight='light'] {
		opacity: 0.3;
	}

	.top-theme-toggle:focus-visible .top-theme-icon[data-weight='light'] {
		opacity: 0;
	}

	.top-theme-toggle:focus-visible .top-theme-icon[data-weight='solid'] {
		opacity: 0.6;
	}

	@media (hover: hover) and (pointer: fine) {
		.top-theme-toggle:hover .top-theme-icon[data-weight='light'] {
			opacity: 0;
		}

		.top-theme-toggle:hover .top-theme-icon[data-weight='solid'] {
			opacity: 0.6;
		}
	}

	@media (hover: none) and (pointer: coarse) {
		.top-theme-toggle:not(:focus-visible) .top-theme-icon[data-weight='solid'] {
			display: none;
		}
	}
</style>
