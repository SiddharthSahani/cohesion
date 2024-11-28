<script>
    import Board from '../components/Board.svelte';
    import BoardHeader from '../components/BoardHeader.svelte';
    import TriesLeft from '../components/TriesLeft.svelte';

    const cells = [
        'Pickaxe',
        'Obsidian',
        'Steve',
        'Alex',
        'Ammo',
        'Tree',
        'Tycoon',
        'Fantasy',
        'Steak',
        'Zombie',
        'Catapult',
        'Buggy',
        'Mushroom',
        'Racing',
        'Wood',
        'Pigs'
    ];

    const shuffleBoardFn = () => {
        alert('shuffleBoardFn');
    };
    const submitFn = () => {
        alert('submitFn');
    };
</script>

<div class="h-full">
    <BoardHeader {shuffleBoardFn} {submitFn} />
    <Board cellContent={cells} />
    <TriesLeft triesLeft={4} totalTries={6} />
</div>
