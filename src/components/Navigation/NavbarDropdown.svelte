<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import DropdownLink from './DropdownLink.svelte';

	let open = $state(false);
	let element: HTMLUListElement | null = $state(null);

	const { section} = $props();
</script>

<button
	type="button"
	aria-expanded={open}
	class="group flex w-full items-center justify-between font-inter text-[14px] font-medium transition-colors duration-400"
	onclick={() => (open = !open)}
>
		<span class="group-hover:translate-x-2 group-hover:text-(--acc) transition-[color,translate] duration-400">
			{section.title.toUpperCase()}
		</span>
	<div class="duration-400 opacity-30" class:rotate-180={open} class:opacity-60={open}>
		<Fa icon={faChevronDown} />
	</div>
</button>
<ul
	bind:this={element}
	class="acc-cycle ms-2 flex flex-col gap-2 overflow-hidden text-silver transition-[height,padding-bottom,margin-bottom] duration-400 fade-bottom"
	style:height={open && element ? `${element.scrollHeight + 28}px` : '0px'}
	style:padding-bottom={open ? '28px' : '0'}
	style:margin-bottom={open ? '0' : '28px'}
	class:mt-4={open}
>
	{#each section.children as { slug, title }}
		<li>
			<DropdownLink {slug} {title}/>
		</li>	
	{/each}
</ul>


<style>
	.fade-bottom {
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0,
    		black calc(100% - 28px),
    		transparent 100%
		);
		mask-image: linear-gradient(
			to bottom,
			black 0,
			black calc(100% - 28px),
			transparent 100%
		);
	}
</style>
