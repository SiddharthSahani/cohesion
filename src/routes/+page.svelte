<script>
    import { Plus, Search } from 'lucide-svelte';
    import BoardCard from '../components/BoardCard.svelte';

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

<div class="flex h-full w-full flex-col gap-4 p-4 sm:flex-row">
    <div class="h-12 rounded-md bg-tertiary sm:h-auto sm:w-3/12 sm:max-w-[175px]">
        <div
            class="text-md flex h-full w-full items-center justify-center truncate font-semibold text-white"
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
                <div class="flex items-center gap-2 rounded-lg bg-secondary p-2">
                    <Search size="24" strokeWidth="3" class="text-white/80" />
                    <input
                        type="text"
                        bind:value={searchInput}
                        class="bg-secondary text-lg font-semibold text-foreground/50 outline-none"
                        placeholder="Search Cohesions"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-4">
                <div class="text-2xl font-bold text-white">Trending Cohesions</div>
                <div class="flex flex-col gap-3">
                    {#each visibleBoards as board}
                        <BoardCard {...board} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
