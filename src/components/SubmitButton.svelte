<script>
	import { animate } from 'motion';
	import { ChevronsRight } from 'lucide-svelte';
</script>

<button
	on:click={async () => {
		console.log('clicked');
	}}
	class="relative flex h-auto gap-1 overflow-hidden rounded border border-white/25 bg-black/75 p-1 pr-4 font-bold text-white"
>
	<div
		class="chevdiv absolute left-0 top-0 flex h-full transform items-center justify-center rounded-sm bg-yellow-400 text-black"
	>
		<ChevronsRight strokeWidth="3" />
	</div>
	<span class="text relative z-10 pl-8">Submit</span>
</button>

<style>
	.chevdiv {
		width: 2rem; /* Adjust this width to fit the chevron */
		transition: width 0.3s ease-in-out;
	}
	button:hover .chevdiv {
		width: 100%; /* Adjust this to cover the remaining space */
	}
	.text {
		transition:
			transform 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
	}
	button:hover .text {
		transform: translateX(100%);
		opacity: 0;
	}
</style>
