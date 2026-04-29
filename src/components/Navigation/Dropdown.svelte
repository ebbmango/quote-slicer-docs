<script lang="ts">
	import Fa from 'svelte-fa';

	import Droplink from './Droplink.svelte';
	import { faArrowDownRight } from '@awesome.me/kit-d1ffd5714e/icons/sharp/light';

	let expanded = $state(false);
	let element: HTMLUListElement | null = $state(null);

	const { section } = $props();
	let title = $derived(section.title);

	const blurOnPointerLeave = (event: PointerEvent) => {
		(event.currentTarget as HTMLButtonElement).blur();
	};
</script>

<button
	type="button"
	aria-expanded={expanded}
	class="group flex w-full items-center justify-between opacity-60 duration-500 focus:border-0 focus:ring-0 focus:outline-none focus-visible:opacity-60"
	onclick={() => (expanded = !expanded)}
	onpointerleave={blurOnPointerLeave}
>
	<span class="nav-header duration-500 group-hover:translate-x-2 group-focus-visible:translate-x-2">
		{title}
	</span>
	<div
		class="opacity-0 transition-all duration-400 group-hover:opacity-30 group-focus-visible:opacity-30"
		class:rotate-45={expanded}
	>
		<Fa icon={faArrowDownRight} />
	</div>
</button>
<ul
	bind:this={element}
	class="fade-bottom ms-2 flex flex-col gap-2 overflow-hidden transition-[height,padding-bottom,margin-bottom,margin-top] duration-400"
	style:height={expanded && element ? `${element.scrollHeight + 28}px` : '0px'}
	style:padding-bottom={expanded ? '28px' : '0'}
	style:margin-bottom={expanded ? '0' : '28px'}
	style:margin-top={expanded ? '16px' : '0'}
>
	{#each section.children as { path, title, accentIndex }}
		<li class={`acc-${accentIndex}`}>
			<Droplink {path} {title} visible={expanded} />
		</li>
	{/each}
</ul>

<style>
	.fade-bottom {
		-webkit-mask-image: linear-gradient(
			to bottom,
			black 0,
			black calc(100% - 35px),
			transparent 100%
		);
		mask-image: linear-gradient(to bottom, black 0, black calc(100% - 35px), transparent 100%);
	}
</style>
