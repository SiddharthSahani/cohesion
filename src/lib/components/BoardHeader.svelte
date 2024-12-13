<script>
    import { fade } from 'svelte/transition';
    import { elasticInOut } from 'svelte/easing';
    import { scale } from 'svelte/transition';
    import SubmitButton from './SubmitButton.svelte';
    import { Info, Shuffle, AlertTriangle } from 'lucide-svelte';
    import { Share2 } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { page } from '$app/stores';

    let { shuffleBoardFn, submitEnable, submitFn } = $props();
    let showReportDialog = $state(false);
    let selectedReason = $state('');
    let isSubmitting = $state(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        toast('Link copied to clipboard', {
            type: 'success',
            duration: 2000
        });
    };

    const REPORT_REASONS = {
        INAPPROPRIATE: {
            label: 'inappropriate_content',
            icon: '🚫',
            description: 'Content that violates community guidelines'
        },
        OFFENSIVE: {
            label: 'offensive_language',
            icon: '⚠️',
            description: 'Harmful or disrespectful content'
        },
        INCORRECT: {
            label: 'incorrect_answer',
            icon: '❌',
            description: 'Solution is wrong or misleading'
        },
        OTHER: {
            label: 'other',
            icon: '⚡',
            description: 'Something else needs attention'
        }
    };

    async function handleReport({ reason }) {
        if (isSubmitting) return;
        isSubmitting = true;
        selectedReason = reason;
        console.log('Submitting report:', REPORT_REASONS[reason].label);
        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: window.location.href,
                    reason: REPORT_REASONS[reason].label,
                    user: $page.data.session || null
                })
            });

            const data = await response.json();

            if (response.status === 429) {
                const resetAt = new Date(data.resetAt);
                const minutesLeft = Math.ceil((resetAt - new Date()) / (1000 * 60));
                toast.error(`Limit reached! Try again in ${minutesLeft} minutes`, {
                    duration: 5000
                });
                return;
            }

            if (!response.ok) throw new Error(data.error || 'Failed to submit report');

            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success('Thanks for helping keep the community safe! 🌟');
            showReportDialog = false; // Close the dialog on success
        } catch (error) {
            console.error('Report error:', error);
            toast.error(error.message || 'Failed to submit report');
        } finally {
            isSubmitting = false;
            selectedReason = '';
        }
    }
</script>

<div
    class="text-md flex w-full select-none justify-between px-4 pb-2 font-bold text-foreground sm:text-lg"
>
    <div class="flex gap-2">
        <button
            onclick={handleCopy}
            class="flex w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-tertiary bg-secondary/50 px-4 opacity-75 hover:bg-primary/10 sm:flex"
        >
            <Share2 size="20" strokeWidth="2.5" class="text-primary" />
            <span class="hidden sm:flex"> Share</span>
        </button>

        <button
            onclick={() => (showReportDialog = true)}
            class="flex w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-tertiary bg-secondary/50 px-4 opacity-75 hover:bg-primary/10 sm:flex"
        >
            <AlertTriangle size="20" strokeWidth="2.5" class="text-primary" />
            <span class="hidden sm:flex">Report </span>
        </button>
    </div>

    <div class="flex gap-2">
        <button
            onclick={shuffleBoardFn}
            class="hover:rotate-5 flex aspect-square h-full items-center justify-center rounded-lg border-2 border-accent/10 bg-secondary/50 p-2 text-primary transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 active:scale-95"
        >
            <Shuffle size="24" strokeWidth="3" />
        </button>
        <SubmitButton {submitFn} enable={submitEnable} />
    </div>
</div>

{#if showReportDialog}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm {showReportDialog
            ? ''
            : 'hidden'}"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="w-full max-w-md rounded-lg border border-input bg-background p-6 shadow-lg"
            transition:scale={{ duration: 200 }}
        >
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold">Help Us Improve! 🚀</h2>
                <button
                    class="rounded-full p-2 hover:bg-secondary/30"
                    onclick={() => (showReportDialog = false)}
                >
                    ✕
                </button>
            </div>

            <div class="flex flex-col gap-3">
                {#each Object.entries(REPORT_REASONS) as [key, value]}
                    <button
                        class="group relative overflow-hidden rounded-lg border border-input/50 bg-secondary/20 p-4 text-left transition-all hover:border-primary/50 hover:bg-secondary/30 {selectedReason ===
                        key
                            ? 'border-primary bg-primary/10'
                            : ''}"
                        onclick={() => handleReport({ reason: key })}
                        disabled={isSubmitting}
                    >
                        <div class="flex items-center gap-3">
                            <span class="text-2xl transition-transform group-hover:scale-110"
                                >{value.icon}</span
                            >
                            <div>
                                <div class="font-semibold">{value.label}</div>
                                <div class="text-sm text-muted-foreground">{value.description}</div>
                            </div>
                        </div>

                        {#if selectedReason === key && isSubmitting}
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
                            ></div>
                        {/if}
                    </button>
                {/each}
            </div>

            <div class="mt-6 text-center text-sm text-muted-foreground">
                Your feedback helps make our community better
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .group:hover .text-2xl {
        animation: pulse 1s infinite;
    }
</style>
