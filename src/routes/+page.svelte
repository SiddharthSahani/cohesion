<script>
    import { Plus, Search, Star } from 'lucide-svelte';
    import BoardCard from '$lib/components/BoardCard.svelte';
    import { animate } from 'motion';
    let { data } = $props();
    let searchInput = $state('');

    const visibleBoards = $derived(
        data.boards.filter((board) => {
            const boardName = board.name.toLowerCase();
            const search = searchInput.toLowerCase();
            return boardName.includes(search);
        })
    );

    function handleStarHover(node) {
        node.addEventListener('mouseenter', () => {
            animate(node, {
                duration: 0.6,
                easing: 'ease-in-out'
            });

            const starIcon = node.querySelector('.star-icon');
            animate(
                starIcon,
                {
                    scale: [1, 1.05, 1]
                },
                {
                    duration: 0.6,
                    easing: 'ease-in-out'
                }
            );
        });
    }

    // Bouncy animation for the Create New button
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
    <div class="flex h-full w-full flex-col gap-4 p-4">
        <div class="rounded-md bg-secondary/50 px-4 py-2">
            <a
                href="https://github.com/SiddharthSahani/Cohesion"
                class="text-md flex h-full w-full select-none items-center justify-start gap-1 truncate font-bold text-foreground"
                use:handleStarHover
            >
                <Star size="20" strokeWidth="2.5" class="star-icon" />

                <span class="text-md truncate px-1 font-bold text-foreground">
                    Our Code is Public on GitHub, feel free to Star it!</span
                >
            </a>
        </div>
        <div class="flex-grow sm:w-full">
            <div class="flex h-32 flex-col gap-4">
                <div class="flex gap-4 rounded-sm bg-foreground/[4.5%] p-2">
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
                    <!--  -->
                </div>
                <div class="flex flex-col gap-4">
                    <div class="text-2xl font-bold text-foreground">Trending Cohesions</div>
                    <div class="flex h-full flex-col gap-3 overflow-y-auto py-4">
                        {#each visibleBoards as board}
                            <BoardCard {...board} />
                        {/each}
                        <!-- {JSON.stringify(visibleBoards)} -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
