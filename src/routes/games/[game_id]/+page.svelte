<script>
    import Board from '$lib/components/Board.svelte';
    import BoardHeader from '$lib/components/BoardHeader.svelte';
    import TriesLeft from '$lib/components/TriesLeft.svelte';
    import { incrementPlay, incrementWin } from '$lib/gameApi';
    import { page } from '$app/stores';
    import { toast } from 'svelte-sonner';

    let { data } = $props();

    // Game states
    let gameState = $state({
        status: 'playing', // 'playing', 'won', 'lost'
        correctClusters: [],
        cells: data.clusters
            .flatMap((cluster) => cluster.words)
            .map((word) => ({
                word,
                isSelected: false,
                isUsed: false,
                cluster: null
            })),
        wrongCells: [],
        triesLeft: 6
    });

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
            gameState.status = 'won';
        } catch (error) {
            console.error('Error:', error);
        }
    }

    $effect(() => {
        if (gameState.triesLeft === 0) {
            handleGamePlay();
            gameState.status = 'lost';
        }
    });

    $effect(() => {
        if (gameState.wrongCells.length !== 0) {
            setTimeout(() => {
                gameState.wrongCells = [];
            }, 2000);
        }
    });

    const shuffleBoardFn = () => {
        gameState.cells = gameState.cells
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    };

    const submitFn = () => {
        const selectedWords = gameState.cells
            .filter((cell) => cell.isSelected)
            .map((cell) => cell.word);
        let clusterIndex = -1;

        // Find a matching cluster
        for (let i = 0; i < data.clusters.length; i++) {
            if (gameState.correctClusters.includes(i)) {
                continue;
            }

            if (
                selectedWords.filter((word) => data.clusters[i].words.includes(word)).length === 4
            ) {
                clusterIndex = i;
                gameState.correctClusters.push(i);
                break;
            }
        }

        // If no matching cluster is found
        if (clusterIndex === -1) {
            gameState.triesLeft--;
            gameState.wrongCells = gameState.cells.filter((cell) => cell.isSelected);
        } else {
            // Correct cluster found
            for (let i = 0; i < gameState.cells.length; i++) {
                if (gameState.cells[i].isSelected) {
                    gameState.cells[i].isUsed = true;
                    gameState.cells[i].cluster = clusterIndex;
                }
            }
            toast.success(data.clusters[clusterIndex].context);
        }

        // Win condition
        if (gameState.cells.every((cell) => cell.isUsed)) {
            handleGameWin();
            handleGamePlay();
        }

        // Deselect all cells after submission
        gameState.cells.forEach((cell) => (cell.isSelected = false));
    };

    const selectCellFn = (index) => {
        if (gameState.cells[index].isUsed || gameState.status !== 'playing') {
            return;
        }

        if (!gameState.cells[index].isSelected) {
            if (gameState.cells.reduce((acc, cell) => acc + cell.isSelected, 0) >= 4) {
                return;
            }
            gameState.cells[index].isSelected = true;
        } else {
            gameState.cells[index].isSelected = false;
        }
    };

    shuffleBoardFn();
</script>

<svelte:head>
    <title>Cohesion</title>
    <meta name="description" content="Get cohesions and play" />
</svelte:head>

<div class="h-full">
    {#if data.isValid}
        <h1 class="px-4 py-6 text-start text-4xl font-bold capitalize text-foreground">
            {data.board_title}
        </h1>
        <BoardHeader
            {shuffleBoardFn}
            {submitFn}
            submitEnable={gameState.status === 'playing' &&
                gameState.cells.reduce((acc, cell) => acc + cell.isSelected, 0) === 4}
        />
        <Board
            cells={gameState.cells}
            {selectCellFn}
            wrongCells={gameState.wrongCells}
            correctClusters={gameState.correctClusters.map((index) => data.clusters[index])}
            gameStatus={gameState.status}
        />
        <TriesLeft triesLeft={gameState.triesLeft} totalTries={6} />
    {:else}
        <h1 class="py-12 text-center text-4xl font-bold text-foreground">Game not found</h1>
        <p class="py-12 text-center text-xl text-foreground">
            No game exists with the ID <code>{data.game_id}</code>
        </p>
    {/if}
</div>
