<script>
    import BoardCell from './BoardCell.svelte';

    let { cells, selectCellFn, wrongCells } = $props();
</script>

<div class="board-container flex items-center justify-center p-4">
    <div
        class="grid auto-rows-fr grid-cols-2 gap-4 rounded-xl
               bg-gradient-to-b from-secondary/60 to-secondary/40
               p-6 shadow-lg sm:grid-cols-3 md:grid-cols-4"
        style="min-width: min(90vw, 800px);"
    >
        {#each cells as cell, i}
            <div
                class="cell-wrapper {i === cells.length - 1
                    ? 'w-full sm:col-span-3 sm:justify-self-center sm:bg-red-500/0 md:col-span-1 md:bg-transparent'
                    : ''}"
                style="animation-delay: 100ms"
            >
                <BoardCell
                    isSelected={cell.isSelected}
                    text={cell.word}
                    isUsed={cell.isUsed}
                    isWrong={wrongCells.includes(cell)}
                    selectCellFn={() => selectCellFn(i)}
                />
            </div>
        {/each}
    </div>
</div>

<style>
    .board-container {
        min-height: 400px;
    }

    .cell-wrapper {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
