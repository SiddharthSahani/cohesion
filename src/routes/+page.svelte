<script>
    import Board from '../components/Board.svelte';
    import SubmitButton from '../components/SubmitButton.svelte';
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
</script>

<div class="">
    <SubmitButton />
    <Board cellContent={cells} />
    <TriesLeft triesLeft={4} totalTries={6} />
</div>
