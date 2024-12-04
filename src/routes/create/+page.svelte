<script>
    export let form;
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import SubmitButton from '../../components/SubmitButton.svelte';
    import * as Card from '$lib/components/ui/card/index.js';
</script>

<div class="container mx-auto mt-4 h-screen">
    <h1 class="mb-4 text-2xl font-bold">Create New Game</h1>

    {#if form?.message}
        <div class="mb-4 text-red-500">
            {form.message}
        </div>
    {/if}

    <form method="POST" class="space-y-4 text-white">
        <Card.Root class="border-input bg-white/5 text-white">
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
                        class="w-full rounded border p-2"
                        value={form?.title || ''}
                    />
                </div>

                {#each Array(4).fill(null) as _, clusterIndex}
                    <div class="mb-4 rounded border border-input p-4">
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
                                    {#each Array(4).fill(null) as _, wordIndex}
                                        <Input
                                            type="text"
                                            name={`cluster-${clusterIndex}-word-${wordIndex}`}
                                            placeholder={`Word ${wordIndex + 1}`}
                                            class="rounded border p-2"
                                            required
                                        />
                                    {/each}
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value="context">
                                <div>
                                    <Textarea
                                        name={`cluster-${clusterIndex}-context`}
                                        placeholder="Context for the cluster"
                                        id={`cluster-${clusterIndex}-context`}
                                        class="w-full rounded border p-2"
                                    ></Textarea>
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                {/each}
            </Card.Content>
            <Card.Footer>
                <SubmitButton type="submit" class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
                    >Create Game</SubmitButton
                >
            </Card.Footer>
        </Card.Root>
    </form>
</div>

<style>
    /* Add any additional styles you need here */
</style>
