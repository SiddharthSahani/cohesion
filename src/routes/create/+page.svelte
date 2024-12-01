<!-- src/routes/games/create/+page.svelte -->
<script>
    export let form;
    export let data;
</script>

<div class="container mx-auto mt-4 h-screen p-4">
    <h1 class="mb-4 text-2xl font-bold">Create New Game</h1>

    {#if form?.message}
        <div class="mb-4 text-red-500">
            {form.message}
        </div>
    {/if}

    <form method="POST" class="space-y-4">
        <div>
            <label for="title" class="mb-2 block">Game Title</label>
            <input
                type="text"
                name="title"
                id="title"
                required
                class="w-full rounded border p-2"
                value={form?.title || ''}
            />
        </div>

        {#each Array(4).fill(null) as _, clusterIndex}
            <div class="rounded border p-4">
                <h2 class="mb-2 text-lg font-semibold">Cluster {clusterIndex + 1}</h2>

                <div class="mb-2 grid grid-cols-4 gap-2">
                    {#each Array(4).fill(null) as _, wordIndex}
                        <input
                            type="text"
                            name={`cluster-${clusterIndex}-word-${wordIndex}`}
                            placeholder={`Word ${wordIndex + 1}`}
                            class="rounded border p-2"
                            required
                        />
                    {/each}
                </div>

                <div>
                    <label for={`cluster-${clusterIndex}-context`} class="mb-2 block"
                        >Cluster Context</label
                    >
                    <textarea
                        name={`cluster-${clusterIndex}-context`}
                        id={`cluster-${clusterIndex}-context`}
                        class="w-full rounded border p-2"
                        required
                    ></textarea>
                </div>
            </div>
        {/each}

        <button type="submit" class="rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
            Create Game
        </button>
    </form>
</div>
