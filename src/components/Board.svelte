<script>
    import BoardCell from './BoardCell.svelte';

    let { cells, selectCellFn, wrongCells } = $props();

    $effect(() => {
        console.log('Board wrongCells', wrongCells);
    });

    // Create a derived value that will update whenever wrongCells changes
    const isWrongCell = $derived((index) => {
        return wrongCells.has(index);
    });
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
                    : ''} {isWrongCell(i) ? 'shake' : ''}"
                style="animation-delay: {i * 40}ms"
            >
                <BoardCell
                    text={cell.word}
                    isSelected={cell.isSelected}
                    isUsed={cell.isUsed}
                    isWrong={isWrongCell(i)}
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
        animation: fadeIn 0.3s ease-out backwards;
    }

    .cell-wrapper.shake {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }
        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }
</style>
