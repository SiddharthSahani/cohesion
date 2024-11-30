<script>
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
    <h1 class="py-12 text-center text-4xl font-bold text-white">{data.board_title}</h1>
    <BoardHeader {shuffleBoardFn} {submitFn} />
    <Board cellContent={data.cells} />
    <TriesLeft triesLeft={4} totalTries={6} />
</div>
