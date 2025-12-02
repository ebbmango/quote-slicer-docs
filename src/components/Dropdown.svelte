<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';

	let hover = $state(false);
	let open = $state(false);
	let element: HTMLDivElement | null = $state(null);

	const { section, color } = $props();

	$effect(() => {
		console.log(section.title, element);
	});
</script>

<div>
	<button
		class="group flex w-full items-center justify-between font-inter text-[14px] font-medium"
		onmouseenter={() => (hover = true)}
		onmouseleave={() => (hover = false)}
		onclick={() => (open = !open)}
	>
		<span class="duration-300 group-hover:ms-2" style="color: {hover && color}">
			{section.title.toUpperCase()}
		</span>
		<Fa icon={faChevronDown} />
	</button>

	<div
		bind:this={element}
		class="ms-2 flex flex-col gap-2 overflow-hidden text-silver duration-400"
		style:height={open ? element.scrollHeight + 'px' : 0}
		class:mt-4={open}
	>
		{#each section.children as child, i}
			<a href={child.slug}>{child.title}</a>
		{/each}
	</div>
</div>
