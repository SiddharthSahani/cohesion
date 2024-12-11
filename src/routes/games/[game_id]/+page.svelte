<script>
    import Board from '$lib/components/Board.svelte';
    import BoardHeader from '$lib/components/BoardHeader.svelte';
    import TriesLeft from '$lib/components/TriesLeft.svelte';
    import { incrementPlay, incrementWin } from '$lib/gameApi';
    import { page } from '$app/stores';
    import { toast } from 'svelte-sonner';

    let { data } = $props();
    let cells = $state(
        data.clusters
            .flatMap((cluster) => cluster.words)
            .map((word) => ({
                word,
                isSelected: false,
                isUsed: false
            }))
    );
    let wrongCells = $state([]);
    let triesLeft = $state(6);
    let clustersUsed = [];

    async function handleGamePlay() {
        try {
            await incrementPlay(data.game_id);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleGameWin() {
        try {
            await incrementWin(data.game_id);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // when notried left is 0, game is over
    $effect(() => {
        if (triesLeft === 0) {
            handleGamePlay();
        }
    });

    $effect(() => {
        if (wrongCells.length !== 0) {
            setTimeout(() => {
                wrongCells = [];
            }, 2000);
        }
    });

    const shuffleBoardFn = () => {
        cells = cells
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    };

    const submitFn = () => {
        const selectedWords = cells.filter((cell) => cell.isSelected).map((cell) => cell.word);
        let clusterIndex = -1;

        // Find a matching cluster
        for (let i = 0; i < data.clusters.length; i++) {
            if (clustersUsed.includes(i)) {
                continue;
            }

            if (
                selectedWords.filter((word) => data.clusters[i].words.includes(word)).length === 4
            ) {
                clusterIndex = i;
                clustersUsed.push(i);
                break;
            }
        }

        // If no matching cluster is found
        if (clusterIndex === -1) {
            triesLeft--;
            wrongCells = cells.filter((cell) => cell.isSelected);
        } else {
            // Correct cluster found
            for (let i = 0; i < cells.length; i++) {
                cells[i].isUsed |= cells[i].isSelected;
            }
            // console log the context
            console.log(data.clusters[clusterIndex].context);
            toast.success(data.clusters[clusterIndex].context);
        }
        // win condition
        if (cells.every((cell) => cell.isUsed)) {
            handleGameWin();
            handleGamePlay();
        }

        // Deselect all cells after submission
        for (let i = 0; i < cells.length; i++) {
            cells[i].isSelected = false;
        }
    };

    const selectCellFn = (index) => {
        if (cells[index].isUsed) {
            return;
        }

        if (!cells[index].isSelected) {
            if (cells.reduce((acc, cell) => acc + cell.isSelected, 0) >= 4) {
                return;
            }
            cells[index].isSelected = true;
        } else {
            cells[index].isSelected = false;
        }
    };

    shuffleBoardFn();
</script>

<div class="h-full">
    {#if data.isValid}
        <h1 class="px-4 py-6 text-start text-4xl font-bold capitalize text-foreground">
            {data.board_title}
        </h1>
        <BoardHeader
            {shuffleBoardFn}
            {submitFn}
            submitEnable={triesLeft > 0 &&
                cells.reduce((acc, cell) => acc + cell.isSelected, 0) === 4}
        />
        <Board {cells} {selectCellFn} {wrongCells} />
        <TriesLeft {triesLeft} totalTries={6} />
    {:else}
        <h1 class="py-12 text-center text-4xl font-bold text-foreground">Game not found</h1>
        <p class="py-12 text-center text-xl text-foreground">
            No game exists with the ID <code>{data.game_id}</code>
        </p>
    {/if}
</div>
