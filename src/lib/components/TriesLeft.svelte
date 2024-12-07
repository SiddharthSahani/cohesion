<script>
    let { triesLeft = 6, totalTries = 6 } = $props();
    let prevTries = $state(triesLeft);
    let isAnimating = $state(false);
    let breakingHeartIndex = $state(-1);

    function loseLife() {
        if (triesLeft > 0 && !isAnimating) {
            isAnimating = true;
            prevTries = triesLeft;
            breakingHeartIndex = triesLeft;

            setTimeout(() => {
                isAnimating = false;
                breakingHeartIndex = -1;
            }, 2000);
        }
    }

    $effect(() => {
        if (prevTries !== triesLeft) {
            loseLife();
        }
    });
</script>

{#snippet TurnDiv({ left, animating, index })}
    {#if left}
        <div
            class="life-orb h-6 w-6 rounded-full bg-accent sm:h-8 sm:w-8
                   {animating && index === breakingHeartIndex ? 'breaking' : ''} 
                   {animating ? 'animate' : ''}"
        >
            <div class="glow-effect"></div>
            {#if animating && index === breakingHeartIndex}
                <div class="crack left"></div>
                <div class="crack right"></div>
                <div class="final-glow"></div>
            {/if}
        </div>
    {:else}
        <div class="lost-life h-6 w-6 rounded-full bg-accent/50 sm:h-8 sm:w-8"></div>
    {/if}
{/snippet}

<div class="m-auto flex w-min gap-5 rounded-md py-9">
    {#each Array(totalTries) as _, i}
        {@render TurnDiv({ left: i < triesLeft, animating: isAnimating, index: i })}
    {/each}
</div>

<style>
    .life-orb {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
    }

    .life-orb::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1), transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .life-orb:hover::before {
        opacity: 1;
    }

    .glow-effect {
        position: absolute;
        inset: -2px;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 70%);
        opacity: 0.3;
    }

    .final-glow {
        position: absolute;
        inset: -5px;
        background: radial-gradient(circle at center, rgba(255, 215, 0, 0.4), transparent 70%);
        animation: final-pulse 0.5s ease-out forwards;
    }

    .life-orb.animate {
        animation: pulse-and-glow 1s ease-in-out 2;
    }

    .life-orb.breaking {
        animation: disappear 0.8s ease-in-out forwards;
    }

    .crack {
        position: absolute;
        background: rgba(0, 0, 0, 0.7);
        width: 2px;
        height: 0%;
        top: 50%;
        animation: crack-grow 0.3s ease-in-out forwards;
    }

    .crack.left {
        left: 45%;
        transform: rotate(-25deg);
    }

    .crack.right {
        right: 45%;
        transform: rotate(25deg);
    }

    .lost-life {
        opacity: 0;
        transform: scale(0);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes pulse-and-glow {
        0%,
        100% {
            transform: scale(1);
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
        }
        50% {
            transform: scale(1.05);
            box-shadow:
                0 0 10px rgba(255, 215, 0, 0.4),
                0 0 15px rgba(255, 215, 0, 0.2);
        }
    }

    @keyframes disappear {
        0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
        }
        40% {
            transform: scale(1.1);
            opacity: 0.9;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        }
        100% {
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0);
        }
    }

    @keyframes final-pulse {
        0% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.8;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    @keyframes crack-grow {
        0% {
            height: 0%;
            opacity: 0;
        }
        100% {
            height: 70%;
            opacity: 1;
        }
    }

    .breaking {
        animation: shake 0.3s ease-in-out;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-2px);
        }
        75% {
            transform: translateX(2px);
        }
    }

    /* Smooth appearance for lost life */
    .lost-life {
        animation: appear 0.5s ease-out forwards;
    }

    @keyframes appear {
        from {
            transform: scale(0);
            opacity: 0;
        }
        to {
            transform: scale(0.9);
            opacity: 0.3;
        }
    }
</style>
