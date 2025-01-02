<script>
    import BoardCard from '$lib/components/BoardCard.svelte';
    import { Plus, Search, Star, Github } from 'lucide-svelte';
    import { animate } from 'motion';
    import PromoButton from '$lib/components/PromoButton.svelte';
    import Peerlist from '$lib/components/icons/Peerlist.svelte';
    import ProductHunt from '$lib/components/icons/ProductHunt.svelte';
    let { data } = $props();
    let searchInput = $state('');

    const visibleBoards = $derived(
        data.boards.filter((board) => {
            if (!board || !board.name || !board.id) {
                console.log('Invalid board while searching:', board);
                return false;
            }
            const boardName = board.name.toLowerCase();
            const search = searchInput.toLowerCase();
            return boardName.includes(search);
        })
    );

    function handleCreateHover(node) {
        node.addEventListener('mouseenter', () => {
            animate(
                node,
                {
                    scale: [1, 1.025, 1]
                },
                {
                    duration: 0.4,
                    easing: 'ease-out'
                }
            );

            const plusIcon = node.querySelector('.plus-icon');
            animate(
                plusIcon,
                {
                    rotate: [0, 90],
                    scale: [1, 1.025, 1]
                },
                {
                    duration: 0.125,
                    easing: 'ease-out'
                }
            );
        });
    }
</script>

<section class="flex h-full w-full max-w-7xl items-center">
    <div class="flex h-full w-full flex-col gap-2 p-4">
        <div class="flex-grow sm:w-full">
            <section class="flex h-auto flex-col items-center gap-2 py-4 md:flex-row">
                <PromoButton
                    href="https://www.producthunt.com/posts/cohesion-game?utm_source=other&utm_medium=social"
                >
                    <ProductHunt size="16" />
                    <div class="text-md font-medium text-foreground">Upvote on ProductHunt</div>
                </PromoButton>
                <PromoButton href="https://github.com/SiddharthSahani/cohesion">
                    <Github size="16" strokeWidth="3" />
                    <div class="text-md font-medium text-foreground">We are Open Source</div>
                </PromoButton>
                <PromoButton href="https://peerlist.io/tejasbhovad/project/cohesion">
                    <Peerlist size="16" strokeWidth="3" />
                    <div class="text-md font-medium text-foreground">Launched on Peerlist</div>
                </PromoButton>
            </section>

            <div class="flex h-32 flex-col gap-4">
                <div class="flex gap-4 rounded-sm bg-foreground/0 p-0">
                    <a
                        class="flex items-center gap-1 rounded-sm bg-accent px-4 py-1 text-foreground hover:bg-accent/90 dark:text-background"
                        href="/create"
                        use:handleCreateHover
                    >
                        <Plus size="24" strokeWidth="3" class="plus-icon" />
                        <span class="hidden truncate text-lg font-bold sm:flex">Create New</span>
                    </a>
                    <div
                        class="flex w-full select-none items-center gap-2 truncate rounded-lg bg-secondary/50 p-2"
                    >
                        <Search
                            size="24"
                            strokeWidth="3"
                            class="stroke-foreground/50 text-foreground/50"
                        />
                        <input
                            type="text"
                            bind:value={searchInput}
                            class="bg-secondary/0 text-lg font-semibold text-foreground outline-none"
                            placeholder="Search Cohesions"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-0">
                    <div class="text-2xl font-bold text-foreground">Trending Cohesions</div>
                    <div class="flex h-full flex-col gap-3 overflow-y-auto py-4">
                        {#each visibleBoards as board}
                            <BoardCard {...board} />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
