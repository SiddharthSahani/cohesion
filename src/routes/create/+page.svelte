<script>
    import SignInCard from '$lib/components/SignInCard.svelte';
    export let form;
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import SubmitButton from '$lib/components/SubmitButton.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
    import { page } from '$app/stores';
    import Button from '$lib/components/ui/button/button.svelte';
    let contextValues = Array(4).fill('');
</script>

{#if $page.data.session}
    <div class="container mx-auto mt-4 h-screen">
        <h1 class="mb-4 text-2xl font-bold">Create New Game</h1>

        {#if form?.message}
            <div class="mb-4 text-red-500">
                {form.message}
            </div>
        {/if}

        <form method="POST" class="space-y-4 text-foreground">
            <Card.Root class="border-input/50 bg-white/5 text-foreground">
                <Card.Header>
                    <Card.Title>Game Details</Card.Title>
                    <Card.Description>Fill in the details for your new game</Card.Description>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div>
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
                                            required
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
                <Card.Footer class="flex ">
                    <Button
                        type="submit"
                        class="text-md w-full bg-accent font-bold text-background hover:bg-accent/90"
                        on:click={async (event) => {
                            console.log('data', form);
                        }}
                    >
                        Create Game
                    </Button>
                </Card.Footer>
            </Card.Root>
        </form>
    </div>
{:else}
    <div class="flex h-full w-full justify-center px-6"><SignInCard /></div>
{/if}
