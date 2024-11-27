<script>
    import SubmitButton from '../components/SubmitButton.svelte';
    import TurnsLeft from '../components/TurnsLeft.svelte';
</script>

<div class="h-full w-full bg-gray-900">
    <SubmitButton />
    <TurnsLeft turnsLeft={4} totalTurn={6} />
</div>
