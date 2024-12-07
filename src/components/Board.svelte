<script>
    import BoardCell from './BoardCell.svelte';

    let { cells, selectCellFn } = $props();
</script>

<div
    class="grid grid-cols-2 grid-rows-4 gap-6 rounded-lg bg-secondary/50 p-8 sm:grid-cols-3 md:grid-cols-4"
>
    {#each cells as cell, i}
        <BoardCell
            text={cell.word}
            isSelected={cell.isSelected}
            isUsed={cell.isUsed}
            selectCellFn={() => selectCellFn(i)}
        />
    {/each}
</div>
