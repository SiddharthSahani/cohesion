<script>
    import CohesionIcon from './CohesionIcon.svelte';

    let { id, name, timesPlayed } = $props();
</script>

<div class="flex w-full justify-between rounded-xl bg-secondary p-6">
    <div class="flex gap-3">
        <CohesionIcon />
        <div class="text-xl font-semibold text-white">{name}</div>
    </div>
    <div class="text-xl font-semibold text-white/50">{timesPlayed} matches played</div>
</div>
