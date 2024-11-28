<script>
    let { triesLeft, totalTries = 5 } = $props();
</script>

{#snippet TurnDiv({ left })}
    {#if left}
        <div class="oscillating-border h-12 w-12 rounded-full bg-accent"></div>
    {:else}
        <div class="oscillating-border h-12 w-12 rounded-full bg-secondary"></div>
    {/if}
{/snippet}

<div class="flex w-min gap-5 rounded-md bg-primary/10 px-3 py-1">
    {#each Array(totalTries) as _, i}
        {@render TurnDiv({ left: i < triesLeft })}
    {/each}
</div>

<style>
    @keyframes oscillate {
        0% {
            border-radius: 50%;
            margin: 0px -8px;
        }
        50% {
            border-radius: 0%;
            margin: 0px -8px;
        }
        100% {
            border-radius: 50%;
            margin: 0px -8px;
        }
    }

    .oscillating-border {
        animation: oscillate 2s infinite;
    }
</style>
