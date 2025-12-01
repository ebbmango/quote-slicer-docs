<script lang="ts">
	import { faChevronDown } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import Fa from 'svelte-fa';
	const { section, color } = $props();

	let hover = $state(false);

	$inspect(color);
</script>

{#if section.children}
	<button
		class="group flex w-full items-center justify-between font-inter text-[14px] font-medium"
		onmouseenter={() => {
			hover = true;
		}}
		onmouseleave={() => {
			hover = false;
		}}
	>
		<span class="duration-300 group-hover:ms-2" style="color: {hover && color}"
			>{section.title.toUpperCase()}</span
		>

		<Fa icon={faChevronDown} />
	</button>
{:else}
	<a
		href={section.slug}
		class="group flex w-full items-center justify-between font-inter text-[14px] font-medium"
		onmouseenter={() => (hover = true)}
		onmouseleave={() => (hover = false)}
	>
		<span class="duration-300 group-hover:ms-2" style="color: {hover ? color : ''}">
			{section.title.toUpperCase()}
		</span>
	</a>
{/if}
