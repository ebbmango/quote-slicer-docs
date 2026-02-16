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
	class="group flex w-full items-center justify-between font-inter text-[14px] font-medium"
	onclick={() => (open = !open)}
>
		<span class="ui-link-transition group-hover:translate-x-2 group-hover:text-(--acc)">
			{section.title.toUpperCase()}
		</span>
	<div class="ui-transform-opacity-transition opacity-30" class:rotate-180={open} class:opacity-60={open}>
		<Fa icon={faChevronDown} />
	</div>
</button>
<ul
	bind:this={element}
	class="ui-layout-transition acc-cycle ms-2 flex flex-col gap-2 overflow-hidden text-silver transition-[height,padding-bottom,margin-bottom,margin-top] fade-bottom"
	style:height={open && element ? `${element.scrollHeight + 28}px` : '0px'}
	style:padding-bottom={open ? '28px' : '0'}
	style:margin-bottom={open ? '0' : '28px'}
	style:margin-top={open ? '16px' : '0'}
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
