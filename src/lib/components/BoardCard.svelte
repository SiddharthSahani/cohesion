<script>
    import { Dices } from 'lucide-svelte';
    import { animate } from 'motion';
    let { id, name, timesPlayed } = $props();

    // Function to handle the enter animation
    function handleEnter(node) {
        animate(
            node,
            { opacity: [0, 1], transform: ['translateY(-10px)', 'translateY(0)'] },
            { duration: 0.5 }
        );
    }

    // Function to handle the leave animation
    function handleLeave(node) {
        animate(
            node,
            { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-10px)'] },
            { duration: 0.5 }
        );
    }
</script>

<a
    class="flex w-full items-center justify-between rounded-md bg-secondary/50 p-4 hover:bg-secondary/60"
    href="/games/{id}"
    data-sveltekit-preload-data="tap"
    use:handleEnter
    onoutrostart={handleLeave}
>
    <div class="flex w-3/5 items-center gap-3">
        <div class="aspect-square h-full"><Dices size="24" stroke="2" /></div>

        <span class="select-none truncate text-xl font-semibold capitalize text-foreground"
            >{name}</span
        >
    </div>
    <span class="select-none text-sm font-semibold text-foreground/50"
        >{timesPlayed} matches played</span
    >
</a>
