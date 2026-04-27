<script lang="ts">
	import Fa from 'svelte-fa';
	import { faChevronDown } from '@awesome.me/kit-d1ffd5714e/icons/classic/regular';
	import HighlightWord from '../HighlightWord.svelte';
	import Droplink from './Droplink.svelte';
	import { navigationHighlightWordProps } from './highlightWordProps';

	let open = $state(false);
	let element: HTMLUListElement | null = $state(null);

	const { section } = $props();
	let title = $derived(section.title.toUpperCase());
	let active = $state(false);

	const activate = () => {
		active = true;
	};

	const deactivate = () => {
		active = false;
	};
</script>

<button
	type="button"
	aria-expanded={open}
	onmouseenter={activate}
	onfocus={activate}
	onmouseleave={deactivate}
	onblur={deactivate}
	class="group flex w-full items-center justify-between opacity-40 duration-500 hover:opacity-60 focus:border-0 focus:ring-0 focus:outline-none focus-visible:opacity-60"
	onclick={() => (open = !open)}
>
	<span
		class="ui-link-transition font-mono font-light group-hover:translate-x-2 group-focus-visible:translate-x-2"
	>
		{title}
		<!-- <HighlightWord
			{active}
			class="font-mono font-light"
			fillColor={navigationHighlightWordProps.fillColor}
			delay={navigationHighlightWordProps.delay}
			duration={navigationHighlightWordProps.duration}
			padding={navigationHighlightWordProps.padding}
		>
			{title}
		</HighlightWord> -->
	</span>
	<div
		class="ui-transform-opacity-transition opacity-20"
		class:rotate-180={open}
		class:opacity-60={open}
	>
		<Fa icon={faChevronDown} />
	</div>
</button>
<ul
	bind:this={element}
	class="ui-layout-transition fade-bottom ms-2 flex flex-col gap-2 overflow-hidden text-silver transition-[height,padding-bottom,margin-bottom,margin-top]"
	style:height={open && element ? `${element.scrollHeight + 28}px` : '0px'}
	style:padding-bottom={open ? '28px' : '0'}
	style:margin-bottom={open ? '0' : '28px'}
	style:margin-top={open ? '16px' : '0'}
>
	{#each section.children as { path, title, accentIndex }}
		<li class={`acc-${accentIndex}`}>
			<Droplink {path} {title} />
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
