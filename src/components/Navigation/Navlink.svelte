<script lang="ts">
	import { resolve } from '$app/paths';
	import HighlightWord from '../HighlightWord.svelte';
	import { navigationHighlightWordProps } from './highlightWordProps';

	const { article } = $props();
	let title = $derived(article.title.toUpperCase());

	let active = $state(false);

	const activate = () => {
		active = true;
	};

	const deactivate = () => {
		active = false;
	};
</script>

<a
	href={resolve(article.path)}
	onmouseenter={activate}
	onfocus={activate}
	onmouseleave={deactivate}
	onblur={deactivate}
	class="mb-7 block font-mono font-light opacity-40 duration-500 hover:translate-x-2 hover:text-(--acc) hover:opacity-60 focus:border-0 focus:ring-0 focus:outline-none focus-visible:translate-x-2 focus-visible:text-(--acc) focus-visible:opacity-60"
>
	<HighlightWord
		{active}
		fillColor={navigationHighlightWordProps.fillColor}
		delay={navigationHighlightWordProps.delay}
		duration={navigationHighlightWordProps.duration}
		padding={navigationHighlightWordProps.padding}
	>
		{title}
	</HighlightWord>
</a>
