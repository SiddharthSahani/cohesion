<script>
    import BoardCell from './BoardCell.svelte';
    import { quintOut } from 'svelte/easing';
    import { fly, slide } from 'svelte/transition';

    let { cells, selectCellFn, wrongCells, correctClusters = [], gameStatus } = $props();

    function moveCell(node, { delay = 0, duration = 10 }) {
        return {
            delay,
            duration,
            css: (t) => {
                const eased = quintOut(t);
                return `
                    transform: translate(${(1 - eased) * 50}px, ${(1 - eased) * -50}px);
                     ;
                `;
            }
        };
    }
</script>

<div class="board-container flex items-center justify-center p-4">
    <div
        class="grid w-full grid-flow-row gap-0
               rounded-xl bg-gradient-to-b from-secondary/60
               to-secondary/40 p-6 shadow-lg"
        style="min-width: min(90vw, 800px);"
    >
        <!-- Correct Clusters Section (Row Layout) -->
        {#if correctClusters.length > 0}
            <div class="mb-4 grid w-full grid-flow-row gap-4" transition:slide>
                {#each correctClusters as cluster}
                    <div
                        class="cluster-container group relative grid grid-cols-2 gap-4 rounded-lg bg-accent/5 p-2 sm:grid-cols-4"
                        transition:fly={{ y: 200, duration: 500 }}
                    >
                        <!-- Hover Overlay with Context -->
                        <div
                            class=" duration-350 absolute inset-0 z-20 m-2 flex
                                   cursor-pointer items-center justify-center rounded-xl bg-accent/65
                                   opacity-0 backdrop-blur-lg transition-opacity group-hover:opacity-100"
                        >
                            <span class="text-lg font-bold text-accent-foreground">
                                {cluster.context}
                            </span>
                        </div>

                        {#each cluster.words as word, i}
                            <div transition:moveCell={{ delay: i * 0 }} class="w-full">
                                <BoardCell
                                    text={word}
                                    isUsed={true}
                                    isSelected={false}
                                    selectCellFn={() => {}}
                                />
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Main Game Board -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4">
            {#each cells.filter((cell) => !cell.isUsed) as cell, i}
                <div class="cell-wrapper" style="animation-delay: {i * 100}ms">
                    <BoardCell
                        isSelected={cell.isSelected}
                        text={cell.word}
                        isUsed={cell.isUsed}
                        isWrong={wrongCells.includes(cell)}
                        selectCellFn={() => selectCellFn(cells.indexOf(cell))}
                    />
                </div>
            {/each}
        </div>

        <!-- Game Over States -->
        {#if gameStatus === 'lost'}
            <div
                class="col-span-full mt-4 text-center text-xl font-bold text-destructive"
                transition:slide
            >
                Game Over! You ran out of tries.
            </div>
        {:else if gameStatus === 'won'}
            <div
                class="col-span-full mt-4 text-center text-xl font-bold text-primary"
                transition:slide
            >
                You completed the board successfully
            </div>
        {/if}
    </div>
</div>

<style>
    .board-container {
        min-height: 400px;
    }

    .cell-wrapper {
        animation: fadeIn 0.3s ease-out;
    }

    .cluster-container {
        border: 2px solid var(--accent-color) / 0.2;
        transition: all 0.2s ease-in-out;
    }

    .cluster-container:hover {
        border-color: var(--accent-color) / 0.4;
        transform: scale(1.01);
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
