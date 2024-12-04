<script>
    import { page } from '$app/stores';
    import Board from '../../../components/Board.svelte';
    import BoardHeader from '../../../components/BoardHeader.svelte';
    import TriesLeft from '../../../components/TriesLeft.svelte';

    let { data } = $props();

    const shuffleBoardFn = () => {
        alert('shuffleBoardFn');
    };
    const submitFn = () => {
        alert('submitFn');
    };
</script>

<div class="h-full">
    {#if data.isValid}
        <h1 class="py-12 text-center text-4xl font-bold text-white">{data.board_title}</h1>
        <BoardHeader {shuffleBoardFn} {submitFn} />
        <Board cellContent={data.cells} />
        <TriesLeft triesLeft={4} totalTries={6} />
    {:else}
        <h1 class="py-12 text-center text-4xl font-bold text-white">Game not found</h1>
        <p class="py-12 text-center text-xl text-white">
            No game exists with the ID <code>{data.game_id}</code>
        </p>
    {/if}
</div>
