<script>
    import Card from '$lib/components/ui/card/card.svelte';
    import SignInCard from '$lib/components/SignInCard.svelte';
    import { SignOut } from '@auth/sveltekit/components';
    import { Trash2 } from 'lucide-svelte';
    import { ChartArea, LogOut } from 'lucide-svelte';
    import { on } from 'svelte/events';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    let { data } = $props();
    let games = $state(data.games);
    let validGames = $derived(games.filter((game) => game !== null));
    let totalPlays = $derived(validGames.reduce((acc, game) => acc + (game.playCount || 0), 0));

    const removeGame = (gameId) => {
        games = games.filter((game) => game.id !== gameId);
    };

    function handleEnhance() {
        return async ({ result }) => {
            if (result.type === 'success') {
                const deletedGame = result.data.gameId;
                removeGame(deletedGame);
            }
        };
    }
</script>

{#if $page.data.session}
    <section class="flex h-full w-full max-w-7xl flex-col items-center gap-4 py-6">
        <div class="flex h-full w-full flex-col gap-4 p-4">
            <div
                class="flex h-24 select-none items-center justify-between rounded-md bg-tertiary/20 p-4 backdrop-blur-sm"
            >
                <div class="flex items-center gap-4">
                    <div
                        class="flex items-center gap-1 text-xl font-bold transition-all sm:text-2xl"
                    >
                        <ChartArea size={24} class="h-6 w-6 sm:h-8 sm:w-8" />
                        Statistics
                    </div>
                </div>

                <div class="flex items-center gap-6">
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
                            class={` transform rounded-sm border-2 border-tertiary/50 bg-foreground/5 p-6 transition-all duration-300 ease-out `}
                        >
                            <div class="mb-4 flex items-start justify-between">
                                <h3 class="text-xl font-bold capitalize text-foreground">
                                    {game.title}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="whitespace-nowrap rounded-lg bg-secondary px-2 py-1 text-sm backdrop-blur-sm"
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
                                        <input type="hidden" name="gameTitle" value={game.title} />
                                        <button
                                            type="submit"
                                            class="delete-btn rounded-md p-2 transition-opacity duration-200 hover:bg-black/20 hover:text-red-400 group-hover:opacity-100"
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
                                        <div
                                            class="mb-2 text-sm font-medium capitalize text-foreground/75"
                                        >
                                            {cluster.context}
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            {#each cluster.words as word}
                                                <span
                                                    class="select-none rounded-full bg-white/10 px-3 py-1 text-sm capitalize backdrop-blur-sm transition-colors duration-200"
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
        <SignOut className="font-medium bg-secondary px-4 py-2 rounded-md" />
    </section>
{:else}
    <div class="flex h-full w-full justify-center px-6 py-4"><SignInCard /></div>
{/if}

<style>
    .stat {
        @apply flex flex-col items-center rounded-lg bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/5;
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
