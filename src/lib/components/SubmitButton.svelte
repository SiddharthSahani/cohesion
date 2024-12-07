<script>
    import { animate } from 'motion';
    import { ChevronsRight } from 'lucide-svelte';

    let { enable, submitFn } = $props();
</script>

<button
    onclick={enable ? submitFn : () => {}}
    class="relative overflow-hidden rounded-lg border-2 border-tertiary bg-secondary pr-4 font-bold {enable
        ? 'text-foreground'
        : 'text-foreground/70'}"
>
    <div
        class="{enable &&
            'chevdiv'} absolute left-0 top-0 flex h-full w-12 transform items-center justify-center rounded-sm bg-accent text-black"
    >
        <ChevronsRight size="32" strokeWidth="3" />
    </div>
    <div class="{enable && 'text'} z-10 pl-14">SUBMIT</div>
</button>

<style>
    .chevdiv {
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
