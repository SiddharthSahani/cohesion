<script>
    import CohesionIcon from './CohesionIcon.svelte';

    let { id, name, timesPlayed } = $props();
</script>

<a
    class="flex w-full items-center justify-between rounded-md bg-secondary/50 p-4 hover:bg-secondary/60"
    href="/games/{id}"
    data-sveltekit-preload-data="tap"
>
    <div class="flex gap-3">
        <CohesionIcon />
        <div class="text-xl font-semibold text-foreground">{name}</div>
    </div>
    <div class="text-sm font-semibold text-foreground/50">{timesPlayed} matches played</div>
</a>
