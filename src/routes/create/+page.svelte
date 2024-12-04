<script>
    export let form;
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import SubmitButton from '../../components/SubmitButton.svelte';
</script>

<div class="container mx-auto mt-4 h-screen p-4">
    <h1 class="mb-4 text-2xl font-bold">Create New Game</h1>

    {#if form?.message}
        <div class="mb-4 text-red-500">
            {form.message}
        </div>
    {/if}

    <form method="POST" class="space-y-4 text-white">
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
            <div class="border-input rounded border p-4">
                <h2 class="mb-4 text-lg font-semibold">Cluster {clusterIndex + 1}</h2>

                <Tabs.Root value="words" class="w-full">
                    <Tabs.List>
                        <Tabs.Trigger value="words">Words</Tabs.Trigger>
                        <Tabs.Trigger value="context">Context</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="words">
                        <div class="mt-4 grid grid-cols-4 gap-2">
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
                        <div class="mt-4">
                            <label for={`cluster-${clusterIndex}-context`} class="mb-2 block">
                                Cluster Context
                            </label>
                            <Textarea
                                name={`cluster-${clusterIndex}-context`}
                                id={`cluster-${clusterIndex}-context`}
                                class="w-full rounded border p-2"
                                required
                                rows="4"
                            ></Textarea>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        {/each}

        <!-- <button type="submit" class="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
            Create Game
        </button> -->
        <SubmitButton submitFn={form?.submit || undefined} />
    </form>
</div>
