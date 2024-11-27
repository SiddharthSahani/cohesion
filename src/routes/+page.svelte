<script>
    import SubmitButton from '../components/SubmitButton.svelte';
    import TriesLeft from '../components/TriesLeft.svelte';
</script>

<div class="h-full w-full bg-gray-900">
    <SubmitButton />
    <TriesLeft triesLeft={4} totalTries={6} />
</div>
