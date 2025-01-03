<script>
    import SignInCard from '$lib/components/SignInCard.svelte';
    import SubmitButton from '$lib/components/SubmitButton.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import Button from '$lib/components/ui/button/button.svelte';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import { Toaster, toast } from 'svelte-sonner';
    import { CircleX } from 'lucide-svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    let { form } = $props();
    let contextValues = $state(Array(4).fill(''));
    let errorMessage = $state('');
    let isSubmitting = $state(false); // Add this for loading state
    let selectedFlair = $state('');

    const validateForm = () => {
        const isContextValid = contextValues.every((value) => value.trim() !== '');
        if (!isContextValid) {
            toast.error('Please fill in all context fields.');
            return false;
        }
        return true;
    };
</script>

<svelte:head>
    <title>Create New Game</title>
    <meta name="description" content="Create a new game with custom clusters and words" />
</svelte:head>

{#if $page.data.session}
    <div class="container mx-auto mt-4 h-screen">
        <h1 class="mb-4 text-2xl font-bold">Create New Game</h1>

        {#if form?.message}
            <div class="mb-4 text-red-500">
                {form.message}
            </div>
        {/if}

        <form
            method="POST"
            class="space-y-4 text-foreground"
            use:enhance={() => {
                // Client-side validation
                if (!validateForm()) {
                    return false; // Prevents form submission
                }

                isSubmitting = true; // Show loading state

                return ({ update, result }) => {
                    isSubmitting = false; // Hide loading state

                    // Handle server response
                    if (result.type === 'error') {
                        toast.error(result.error.message);
                    } else if (result.type === 'failure') {
                        toast.error(form?.message || 'Failed to create game');
                    } else if (result.type === 'success') {
                        toast.success('Game created successfully!');
                    }

                    // Update the form
                    update();
                };
            }}
        >
            <Card.Root class="border-input/50 bg-white/5 text-foreground">
                <Card.Header>
                    <Card.Title>Game Details</Card.Title>
                    <Card.Description>Fill in the details for your new game</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div class="flex w-full gap-4">
                        <div class="w-1/2">
                            <label for="title" class="mb-2 block">Game Title</label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                required
                                class="w-full rounded border border-input/35 p-2"
                                value={form?.title || ''}
                            />
                        </div>
                        <div class="w-1/2">
                            <label for="flair" class="mb-2 block">Game Flair</label>
                            <select
                                name="flair"
                                id="flair"
                                required
                                class="4 w-full rounded border border-input/35 p-2"
                                bind:value={selectedFlair}
                            >
                                <option value="" disabled selected>Select a flair</option>
                                <option value="games">Games</option>
                                <option value="sports">Sports</option>
                                <option value="science">Science</option>
                                <option value="history">History</option>
                                <option value="other">Other</option>
                                <!-- Add more predefined flairs as needed -->
                            </select>
                        </div>
                    </div>

                    {#each Array(4) as _, clusterIndex}
                        <div class="mb-4 rounded border border-input/35 p-4">
                            <h2 class="mb-2 text-lg font-semibold">Cluster {clusterIndex + 1}</h2>

                            <Tabs.Root value="words" class="w-full">
                                <Tabs.List class="w-1/3 min-w-48">
                                    <Tabs.Trigger value="words" class="w-1/2 rounded"
                                        >Words</Tabs.Trigger
                                    >
                                    <Tabs.Trigger value="context" class="w-1/2 rounded"
                                        >Context</Tabs.Trigger
                                    >
                                </Tabs.List>
                                <Tabs.Content value="words">
                                    <div class="grid grid-cols-4 gap-2">
                                        {#each Array(4) as _, wordIndex}
                                            <Input
                                                type="text"
                                                name={`cluster-${clusterIndex}-word-${wordIndex}`}
                                                placeholder={`Word ${wordIndex + 1}`}
                                                class="rounded border border-input/35 p-2"
                                                required
                                            />
                                        {/each}
                                    </div>
                                </Tabs.Content>
                                <Tabs.Content value="context">
                                    <div class="space-y-1">
                                        <Textarea
                                            name={`cluster-${clusterIndex}-context`}
                                            placeholder="Context for the cluster"
                                            id={`cluster-${clusterIndex}-context`}
                                            class="w-full rounded border border-input/35 p-2"
                                            maxlength="50"
                                            bind:value={contextValues[clusterIndex]}
                                        />
                                        <p class="text-sm text-foreground/70">
                                            {contextValues[clusterIndex]?.length || 0}/50 characters
                                        </p>
                                    </div>
                                </Tabs.Content>
                            </Tabs.Root>
                        </div>
                    {/each}
                </Card.Content>
                <Card.Footer class="flex flex-col gap-4">
                    <Button
                        type="submit"
                        class="text-md w-full bg-accent font-bold text-background hover:bg-accent/90"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Game'}
                    </Button>
                    {#if errorMessage}
                        <div
                            class="mb-4 flex w-full items-center gap-1 rounded-md bg-red-500/20 px-4 py-1 text-red-500/75"
                        >
                            <CircleX size={20} />
                            {errorMessage}
                        </div>
                    {/if}
                </Card.Footer>
            </Card.Root>
        </form>
    </div>
{:else}
    <div class="flex h-full w-full justify-center px-6"><SignInCard /></div>
{/if}
