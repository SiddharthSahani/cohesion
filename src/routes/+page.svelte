<script>
    import SubmitButton from '../components/SubmitButton.svelte';
    import TriesLeft from '../components/TriesLeft.svelte';
</script>

<div class="h-full w-full bg-background">
    <SubmitButton />
    <TriesLeft triesLeft={4} totalTries={6} />
</div>
