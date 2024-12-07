<script>
    import { animate } from 'motion';
    import { ChevronsRight } from 'lucide-svelte';

    let { submitFn } = $props();
</script>

<button
    onclick={submitFn}
    class="relative overflow-hidden rounded-lg border-2 border-tertiary bg-secondary pr-4 font-bold text-white"
>
    <div
        class="chevdiv absolute left-0 top-0 flex h-full transform items-center justify-center rounded-sm bg-accent text-black"
    >
        <ChevronsRight size="32" strokeWidth="3" />
    </div>
    <div class="text z-10 pl-14">SUBMIT</div>
</button>

<style>
    .chevdiv {
        width: 3rem; /* Adjust this width to fit the chevron */
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
