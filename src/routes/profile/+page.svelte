<script>
    import Card from '$lib/components/ui/card/card.svelte';
    import SignInCard from '$lib/components/SignInCard.svelte';
    import { SignOut } from '@auth/sveltekit/components';
    import { Trash2, ChartArea } from 'lucide-svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import * as Accordion from '$lib/components/ui/accordion/index.js';

    let { data } = $props();
    let games = $state(data.games);
    
    let validGames = $derived(
        games
            .filter((game) => game !== null)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
    
    let totalPlays = $derived(validGames.reduce((acc, game) => acc + (game.playCount || 0), 0));

    const removeGame = (gameId) => {
 
    games = [...games.filter((game) => game.id !== gameId)];
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

            <div class="flex flex-col gap-2">
                <Accordion.Root type="single" class="w-full">
                    {#each validGames as game}
                        <Accordion.Item
                            value={game.id}
                            class="mb-4 rounded-lg border-2 border-tertiary/50 bg-foreground/5"
                        >
                            <Accordion.Trigger class="w-full px-6 py-4">
                                <div class="flex w-full items-center justify-between">
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
                                            useenhance={handleEnhance}
                                            class="inline"
                                        >
                                            <input type="hidden" name="gameId" value={game.id} />
                                            <input
                                                type="hidden"
                                                name="gameTitle"
                                                value={game.title}
                                            />
                                            <button
                                                type="submit"
                                                class="delete-btn rounded-md p-2 transition-opacity duration-200 hover:bg-black/20 hover:text-red-400"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </Accordion.Trigger>
                            <Accordion.Content class="px-6 pb-4">
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
                            </Accordion.Content>
                        </Accordion.Item>
                    {/each}
                </Accordion.Root>
            </div>
        </div>
    </section>
{:else}
    <div class="flex h-full w-full justify-center px-6 py-4">
        <SignInCard />
    </div>
{/if}

<style>
</style>
