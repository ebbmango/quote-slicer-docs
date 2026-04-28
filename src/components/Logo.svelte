<script>
	import Fa from 'svelte-fa';
	import { faSquareQuote } from '@awesome.me/kit-d1ffd5714e/icons/sharp/solid';
</script>

<div
	class="flex h-min items-center justify-center gap-2 overflow-hidden text-nowrap opacity-70 duration-200 hover:opacity-90"
>
	<Fa class="ui-colors-transition font-dm-serif text-6xl dark:text-gray-300" icon={faSquareQuote}
	></Fa>
	<div class="flex flex-col font-mono font-light">
		<span class="ui-colors-transition uppercase">Quote//Slicer</span>
		<span class="ui-colors-transition">Documentation</span>
	</div>
</div>
