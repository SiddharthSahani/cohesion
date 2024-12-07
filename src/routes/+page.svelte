<script>
    import { Plus, Search } from 'lucide-svelte';
    import BoardCard from '$lib/components/BoardCard.svelte';

    let { data } = $props();
    let searchInput = $state('');

    const visibleBoards = $derived(
        data.boards.filter((board) => {
            const boardName = board.name.toLowerCase();
            const search = searchInput.toLowerCase();
            return boardName.includes(search);
        })
    );
</script>

<section class="flex h-full w-full max-w-7xl items-center">
    <div class="flex h-full w-full flex-col gap-4 p-4">
        <div class="h-24 rounded-md bg-tertiary/50">
            <div
                class="text-md flex h-full w-full items-center justify-center truncate font-semibold text-foreground"
            >
                Self Promo Here
            </div>
        </div>
        <div class="flex-grow sm:w-full">
            <div class="flex h-32 flex-col gap-4">
                <div class="flex gap-4 rounded-sm border border-input/50 bg-white/5 p-2">
                    <a
                        class="flex items-center gap-1 rounded-sm bg-accent px-4 py-1 text-background"
                        href="/create"
                    >
                        <Plus size="24" strokeWidth="3" />
                        <span class="truncate text-lg font-bold text-background">Create New</span>
                    </a>
                    <div class="flex items-center gap-2 truncate rounded-lg bg-secondary p-2">
                        <Search size="24" strokeWidth="3" class="text-foreground/80" />
                        <input
                            type="text"
                            bind:value={searchInput}
                            class="bg-secondary text-lg font-semibold text-foreground/50 outline-none"
                            placeholder="Search Cohesions"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="text-2xl font-bold text-foreground">Trending Cohesions</div>
                    <div class="flex flex-col gap-3">
                        {#each visibleBoards as board}
                            <BoardCard {...board} />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
