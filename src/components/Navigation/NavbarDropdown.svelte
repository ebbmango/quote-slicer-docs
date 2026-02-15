<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
	import DropdownLink from './DropdownLink.svelte';

	let open = $state(false);
	let element: HTMLUListElement | null = $state(null);

	const { section} = $props();

</script>

<div>
	<button
		class="group flex w-full items-center justify-between font-inter text-[14px] font-medium"
		onclick={() => (open = !open)}
	>
		<span class="duration-300 group-hover:ms-2 group-hover:text-(--acc)">
			{section.title.toUpperCase()}
		</span>
		<Fa icon={faChevronDown} />
	</button>

	<ul
		bind:this={element}
		class="acc-cycle ms-2 flex flex-col gap-2 overflow-hidden text-silver duration-400"
		style:height={open ? element.scrollHeight + 'px' : 0}
		class:mt-4={open}
	>
		{#each section.children as { slug, title }}
			<li>
				<DropdownLink {slug} {title}/>
			</li>	
		{/each}

	</ul>
</div>
