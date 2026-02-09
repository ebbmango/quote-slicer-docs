<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faBookmark,
		faListTree,
		faSquareQuote
	} from '@awesome.me/kit-d1ffd5714e/icons/classic/solid';
</script>

<div
	class="sticky top-0 flex h-15 w-full items-center justify-between bg-gray-50 px-5 text-gray-300"
>
	<!-- open navigation sidebar -->
	<button>
		<Fa class="text-xl" icon={faListTree}></Fa>
	</button>
	<div class="flex items-center gap-1.5 text-gray-300">
		<Fa class="text-4xl" icon={faSquareQuote}></Fa>
		<div class="flex flex-col items-start text-xs">
			<span>Quote Slicer</span>
			<span>Docs</span>
		</div>
	</div>
	<!-- open chapters sidebar -->
	<button>
		<Fa class="text-xl" icon={faBookmark}></Fa>
	</button>
</div>
