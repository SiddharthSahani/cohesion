<script>
    import BoardCell from './BoardCell.svelte';

    let { cellContent } = $props();
</script>

<div class="grid grid-cols-4 grid-rows-4 gap-6 rounded-lg bg-secondary/50 p-8">
    {#each cellContent as cellText, i}
        <BoardCell text={cellText} isSelected={false} isUsed={false} />
    {/each}
</div>
