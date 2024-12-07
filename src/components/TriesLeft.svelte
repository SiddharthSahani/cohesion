<script>
    let { triesLeft = 6, totalTries = 6 } = $props();
    let prevTries = $state(triesLeft);
    let isAnimating = $state(false);

    // Function to handle life loss
    function loseLife() {
        console.log('left tries', triesLeft);

        if (triesLeft > 0 && !isAnimating) {
            console.log('left tries', triesLeft);
            // triesLeft--;
            isAnimating = true;
            prevTries = triesLeft; // Update previous tries
            // Stop animation after it has played twice
            setTimeout(() => {
                isAnimating = false; // Reset animation state
            }, 2000); // Duration for two pulses (2 x 1s)
        }
    }

    // Example call to loseLife for demonstration purposes
    // You can replace this with your actual game logic
    // function simulateLifeLoss() {
    //     setTimeout(loseLife, 5000); // Automatically lose a life after 5 seconds for testing
    // }

    // simulateLifeLoss(); // Start the simulation

    $effect(() => {
        if (prevTries !== triesLeft) {
            loseLife();
        }
    });
</script>

{#snippet TurnDiv({ left, animating })}
    {#if left}
        <div
            class="pulsing-life h-12 w-12 rounded-full bg-accent {animating ? 'animate' : ''}"
        ></div>
    {:else}
        <div class="h-12 w-12 rounded-full bg-secondary"></div>
    {/if}
{/snippet}

<div class="m-auto flex w-min gap-5 rounded-md py-9">
    {#each Array(totalTries) as _, i}
        {@render TurnDiv({ left: i < triesLeft, animating: isAnimating })}
    {/each}
</div>

<style>
    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    .pulsing-life.animate {
        animation: pulse 1s ease-in-out 2; /* Play pulse animation twice */
    }

    .bg-accent {
        background-color: #4caf50; /* Example accent color */
    }

    .bg-secondary {
        background-color: #f44336; /* Example secondary color */
    }
</style>
