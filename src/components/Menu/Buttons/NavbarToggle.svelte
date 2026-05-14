<script lang="ts">
	import Fa from 'svelte-fa';

	import {
		faBook as bookSolid,
		faBookArrowRight as bookArrow
	} from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';

	import { faBook as bookLight } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';

	let { id, checked = $bindable(false) } = $props<{ id: string; checked?: boolean }>();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;

		event.preventDefault();
		checked = !checked;
	}
</script>

<label for={id} class="nav-toggle-label">
	<input
		{id}
		class="nav-toggle"
		type="checkbox"
		bind:checked
		onkeydown={handleKeydown}
		aria-label="Toggle navigation menu"
	/>
	<span class="nav-toggle-icon nav-toggle-icon-closed">
		<Fa icon={bookLight} />
	</span>
	<span class="nav-toggle-icon nav-toggle-icon-opening">
		<Fa icon={bookArrow} />
	</span>
	<span class="nav-toggle-icon nav-toggle-icon-open">
		<Fa icon={bookSolid} />
	</span>
</label>

<style>
	.nav-toggle {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		-webkit-tap-highlight-color: transparent;
	}

	.nav-toggle:where(:focus, :focus-visible) {
		outline: none;
		box-shadow: none;
	}

	.nav-toggle-label {
		position: relative;
		display: flex;
		width: 1.25rem;
		height: 1.25rem;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: opacity 180ms ease;
	}

	.nav-toggle-label:where(:focus, :focus-visible) {
		outline: none;
		box-shadow: none;
	}

	.nav-toggle-icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 180ms ease;
	}

	.nav-toggle-icon-closed {
		opacity: 0.3;
	}

	.nav-toggle-label:has(.nav-toggle:checked) .nav-toggle-icon-closed,
	.nav-toggle-label:has(.nav-toggle:checked) .nav-toggle-icon-opening {
		opacity: 0;
	}

	.nav-toggle-label:has(.nav-toggle:checked) .nav-toggle-icon-open {
		opacity: 0.6;
	}

	@media (hover: hover) and (pointer: fine) {
		.nav-toggle-label:hover .nav-toggle-icon-closed,
		.nav-toggle-label:has(.nav-toggle:focus-visible) .nav-toggle-icon-closed {
			opacity: 0;
		}

		.nav-toggle-label:hover .nav-toggle-icon-opening,
		.nav-toggle-label:has(.nav-toggle:focus-visible:not(:checked)) .nav-toggle-icon-opening {
			opacity: 0.6;
		}

		.nav-toggle-label:has(.nav-toggle:checked) .nav-toggle-icon-opening,
		.nav-toggle-label:has(.nav-toggle:checked) .nav-toggle-icon-open {
			transition-duration: 0s;
		}

		.nav-toggle-label:has(.nav-toggle:focus):hover .nav-toggle-icon-opening,
		.nav-toggle-label:has(.nav-toggle:focus):hover .nav-toggle-icon-open {
			transition-duration: 0s;
		}

		.nav-toggle-label:has(.nav-toggle:checked) .nav-toggle-icon-opening {
			visibility: hidden;
		}
	}

	@media (hover: none) and (pointer: coarse) {
		.nav-toggle-icon-opening {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-toggle-label {
			transition: none;
		}
	}
</style>
