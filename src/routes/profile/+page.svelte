<script>
    import Card from '$lib/components/ui/card/card.svelte';
    import { Trash2 } from 'lucide-svelte';
    import { ChartArea } from 'lucide-svelte';
    import { enhance } from '$app/forms';

    let { data } = $props();
    let validGames = $derived(data.games.filter((game) => game !== null));
    let totalPlays = $derived(validGames.reduce((acc, game) => acc + (game.playCount || 0), 0));

    function handleEnhance() {
        return async ({ result }) => {
            if (result.type === 'success') {
                // Invalidate all data to force a refresh
                await invalidateAll();
            }
        };
    }
</script>

<section class="flex h-full w-full max-w-7xl items-center">
    <div class="flex h-full w-full flex-col gap-4 p-4">
        <div class="h-24 select-none rounded-md bg-tertiary/50 p-4 backdrop-blur-sm">
            <div class="flex h-full items-center justify-between">
                <div class="flex items-center gap-1 text-xl font-bold transition-all sm:text-2xl">
                    <ChartArea size={24} class="h-6 w-6 sm:h-8 sm:w-8" />
                    Statistics
                </div>
                <div class="flex gap-6">
                    <div class="stat">
                        <span class="text-lg font-bold sm:text-2xl">{validGames.length}</span>
                        <span class="text-sm opacity-75">Total Games</span>
                    </div>
                    <div class="stat">
                        <span class="text-lg font-bold sm:text-2xl">{totalPlays}</span>
                        <span class="text-sm opacity-75">Total Plays</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each validGames as game}
                <div class="group relative overflow-hidden rounded-lg">
                    <div
                        class={` transform rounded-md border-2 border-tertiary bg-foreground/10 p-6 transition-all duration-300 ease-out `}
                    >
                        <div class="mb-4 flex items-start justify-between">
                            <h3 class="text-xl font-bold text-foreground">{game.title}</h3>
                            <div class="flex items-center gap-2">
                                <span
                                    class="rounded-lg bg-secondary px-2 py-1 text-sm backdrop-blur-sm"
                                >
                                    {game.playCount} plays
                                </span>
                                <form
                                    method="POST"
                                    action="?/deleteGame"
                                    use:enhance={handleEnhance}
                                    class="inline"
                                >
                                    <input type="hidden" name="gameId" value={game.id} />
                                    <button
                                        type="submit"
                                        class="delete-btn rounded-md p-1 p-2 transition-opacity duration-200 hover:bg-black/20 hover:text-red-400 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="space-y-3">
                            {#each game.clusters as cluster}
                                <div
                                    class="cluster-card rounded-md bg-black/20 p-3 backdrop-blur-sm transition-all duration-200 hover:bg-black/30"
                                >
                                    <div class="mb-2 text-sm font-medium text-foreground/75">
                                        {cluster.context}
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        {#each cluster.words as word}
                                            <span
                                                class="select-none rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm transition-colors duration-200"
                                            >
                                                {word}
                                            </span>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>

                        <div class="mt-4 flex items-center justify-between">
                            <div class="text-sm text-foreground/75">
                                Created: {new Date(game.createdAt).toLocaleDateString()}
                            </div>
                            <div class="flex items-center gap-2">
                                <span
                                    class="rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm"
                                >
                                    {game.winCount} wins
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    .stat {
        @apply flex flex-col items-center rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/10;
    }

    .cluster-card {
        @apply shadow-lg hover:shadow-xl;
    }

    /* Add a subtle shine effect on hover */
    .card-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;

        transform: skewX(-25deg);
        transition: 0.75s;
    }

    .card-content:hover::before {
        left: 150%;
    }
</style>
