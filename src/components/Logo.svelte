<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<a
	href={resolve('/')}
	class="opacity-transition flex h-min items-center gap-2 opacity-70 hover:opacity-90"
>
	<svg class="size-13 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="96 96 448 448"
		><path
			d="M96 96L544 96L544 544L96 544L96 96zM304 224L192 224L192 336L256 336L256 344C256 357.3 245.3 368 232 368L208 368L208 416L232 416C271.8 416 304 383.8 304 344L304 224zM336 224L336 336L400 336L400 344C400 357.3 389.3 368 376 368L352 368L352 416L376 416C415.8 416 448 383.8 448 344L448 224L336 224z"
		/></svg
	>
	<div class="flex flex-col font-mono font-light">
		<span class="ui-colors-transition uppercase">Quote//Slicer</span>
		<span class="ui-colors-transition">Documentation</span>
	</div>
</a>

<style>
	.opacity-transition {
		transition-property: opacity;
		transition-duration: 300ms;
		transition-timing-function: ease;
	}

	.opacity-transition :global(.ui-colors-transition) {
		transition:
			color 500ms ease,
			background-color 500ms ease,
			border-color 500ms ease;
	}
</style>
