<script>
    import BoardCard from '../components/BoardCard.svelte';

    let { data } = $props();
</script>

<div class="flex h-full w-full p-16">
    <div class="w-3/12 rounded-xl bg-tertiary">
        <div
            class="flex h-full w-full items-center justify-center text-xl font-semibold text-white"
        >
            Self Promo Here
        </div>
    </div>
    <div class="w-9/12 pl-14">
        <div class="h-36 bg-red-500"></div>
        <div class="flex flex-col gap-4">
            {#each data.boards as board}
                <BoardCard {...board} />
            {/each}
        </div>
    </div>
</div>
