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

<div class="flex h-full w-full p-16">
    <div class="w-3/12 rounded-xl bg-tertiary">
        <div
            class="flex h-full w-full items-center justify-center text-xl font-semibold text-white"
        >
            Self Promo Here
        </div>
    </div>
    <div class="w-9/12 pl-14">
        <div class="flex h-36 flex-col gap-8">
            <div class="flex gap-5 rounded-xl bg-white/5 p-4">
                <a class="flex gap-2 rounded-lg bg-accent p-2 px-4" href="/create">
                    <Plus size="32" strokeWidth="2" />
                    <span class="text-2xl font-bold">Create New</span>
                </a>
                <div class="flex gap-3 rounded-lg bg-secondary p-2">
                    <Search size="32" strokeWidth="2" class="text-white/80" />
                    <input
                        type="text"
                        bind:value={searchInput}
                        class="bg-secondary px-6 text-2xl font-semibold text-white/50 outline-none"
                        placeholder="Search Cohesions"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-5">
                <div class="text-4xl font-bold text-white">Trending Cohesions</div>
                <div class="flex flex-col gap-4">
                    {#each visibleBoards as board}
                        <BoardCard {...board} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
