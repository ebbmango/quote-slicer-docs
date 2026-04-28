<script lang="ts">
	import Fa from 'svelte-fa';
	import { theme } from '$lib/theme';
	import { faMoon, faSunBright } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';

	const initialMode = theme.current;
	let displayedMode = $state(initialMode);
	let rotation = $state(initialMode === 'dark' ? 180 : 0);

	const toggle = () => {
		const nextMode = theme.current === 'dark' ? 'light' : 'dark';
		rotation += 180;
		displayedMode = nextMode;
		theme.current = nextMode;
	};

	$effect(() => {
		const currentMode = theme.current;
		if (currentMode === displayedMode) return;

		rotation += 180;
		displayedMode = currentMode;
	});
</script>

<div
	class="group circadian absolute -bottom-9 flex min-h-20 w-10 flex-col items-center justify-between rounded-full opacity-40 hover:opacity-70"
	style:rotate={`${rotation}deg`}
>
	<!-- Negative tabindex prevents focus on the inactive button from breaking the layout during scroll -->
	<button onclick={toggle} class="celestial" tabindex={theme.current === 'light' ? 0 : -1}>
		<span class="circadian block" style:rotate={`${-rotation}deg`}>
			<Fa icon={faSunBright} class="text-xl dark:text-gray-400" />
		</span>
	</button>
	<button onclick={toggle} class="celestial" tabindex={theme.current === 'dark' ? 0 : -1}>
		<span class="circadian block" style:rotate={`${-rotation}deg`}>
			<Fa icon={faMoon} class="text-xl text-gray-400" />
		</span>
	</button>
</div>

<style>
	.circadian {
		transition: all 700ms;
	}

	.celestial {
		transition-duration: 500ms;
	}
</style>
