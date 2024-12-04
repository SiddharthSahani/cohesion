<script>
    import { page } from '$app/stores';
    import Board from '../../../components/Board.svelte';
    import BoardHeader from '../../../components/BoardHeader.svelte';
    import TriesLeft from '../../../components/TriesLeft.svelte';

    let { data } = $props();
    const cells = $state(
        data.clusters
            .flatMap((cluster) => cluster.words)
            .map((word) => ({
                word,
                isSelected: false,
                isUsed: false
            }))
    );
    let triesLeft = $state(6);
    let clustersUsed = [];

    const shuffleBoardFn = () => {
        let cells = cells
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    };
    const submitFn = () => {
        if (triesLeft === 0) {
            alert('You have run out of tries');
            return;
        }

        if (cells.reduce((acc, cell) => acc + cell.isSelected, 0) !== 4) {
            alert('You must select 4 cells to submit');
            return;
        }

        const selectedWords = cells.filter((cell) => cell.isSelected).map((cell) => cell.word);
        let clusterIndex = -1;
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

        if (clusterIndex === -1) {
            alert('No such cluster found :(');
            triesLeft--;
        } else {
            for (let i = 0; i < cells.length; i++) {
                cells[i].isUsed |= cells[i].isSelected;
            }
            alert('Correct Clusters! ' + data.clusters[clusterIndex].context);
        }

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
                alert('You can only select 4 cells at a time');
                return;
            }
            cells[index].isSelected = true;
        } else {
            cells[index].isSelected = false;
        }
    };
</script>

<div class="h-full">
    {#if data.isValid}
        <h1 class="py-12 text-center text-4xl font-bold text-white">{data.board_title}</h1>
        <BoardHeader {shuffleBoardFn} {submitFn} />
        <Board {cells} {selectCellFn} />
        <TriesLeft {triesLeft} totalTries={6} />
    {:else}
        <h1 class="py-12 text-center text-4xl font-bold text-white">Game not found</h1>
        <p class="py-12 text-center text-xl text-white">
            No game exists with the ID <code>{data.game_id}</code>
        </p>
    {/if}
</div>
