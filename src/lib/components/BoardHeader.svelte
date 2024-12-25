<script>
    import posthog from 'posthog-js';
    import { fade } from 'svelte/transition';
    import { elasticInOut } from 'svelte/easing';
    import { scale } from 'svelte/transition';
    import SubmitButton from './SubmitButton.svelte';
    import { Info, Shuffle, AlertTriangle } from 'lucide-svelte';
    import { Share2, Camera } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { page } from '$app/stores';
    import html2canvas from 'html2canvas'; // Import html2canvas

    let { shuffleBoardFn, submitEnable, submitFn, cells, title } = $props();
    let showReportDialog = $state(false);
    let showShareDialog = $state(false);
    let selectedReason = $state('');
    let isSubmitting = $state(false);
    let isCapturing = $state(false);
    const handleCopy = () => {
        posthog.capture('share', {
            url: window.location.href
        });
        navigator.clipboard.writeText(window.location.href);
        toast('Link copied to clipboard', {
            type: 'success',
            duration: 2000
        });
    };
    const handleScreenshot = async () => {
        try {
            isCapturing = true;
            const element = document.querySelector('.screenshot-target');

            // Wait for fonts and images to load
            await document.fonts.ready;
            await Promise.all(
                Array.from(element.querySelectorAll('img'))
                    .filter((img) => !img.complete)
                    .map(
                        (img) =>
                            new Promise((resolve) => {
                                img.onload = img.onerror = resolve;
                            })
                    )
            );

            // Force layout recalculation
            element.style.transform = 'translateZ(0)';
            await new Promise((resolve) => setTimeout(resolve, 100));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: false, // Better compatibility on Vercel
                logging: false,
                backgroundColor: null,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('.screenshot-target');
                    if (clonedElement) {
                        // Force all elements to be visible
                        const allElements = clonedElement.getElementsByTagName('*');
                        for (const el of allElements) {
                            el.style.display = getComputedStyle(el).display;
                            el.style.visibility = 'visible';
                        }
                        // Force container visibility
                        clonedElement.style.display = 'flex';
                        clonedElement.style.visibility = 'visible';
                        clonedElement.style.position = 'relative';
                        clonedElement.style.width = '100%';
                    }
                }
            });

            // Add padding to the screenshot
            const paddedCanvas = document.createElement('canvas');
            const padding = 20;
            paddedCanvas.width = canvas.width + padding * 2;
            paddedCanvas.height = canvas.height + padding * 2;

            const ctx = paddedCanvas.getContext('2d');
            // Use getComputedStyle to match your app's background
            const bgColor = getComputedStyle(document.body).backgroundColor;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            ctx.drawImage(canvas, padding, padding);

            // Convert to blob instead of data URL for better performance
            const blob = await new Promise((resolve) => paddedCanvas.toBlob(resolve, 'image/png'));
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            // use the title as the filename
            link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);

            toast('Screenshot captured and downloaded!', {
                type: 'success',
                duration: 2000
            });
        } catch (error) {
            console.error('Screenshot error:', error);
            toast.error('Failed to capture screenshot. Please try again.');
        } finally {
            isCapturing = false;
        }
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

    async function handleShare() {
        showShareDialog = false;
    }
</script>

<div
    class="text-md flex w-full select-none justify-between px-4 pb-2 font-bold text-foreground sm:text-lg"
>
    <div class="flex gap-2">
        <button
            onclick={() => (showShareDialog = true)}
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

{#if showShareDialog}
    <div
        class="  absolute inset-0 z-50 flex w-full items-center justify-center bg-background/80 backdrop-blur-sm {showShareDialog
            ? ''
            : 'hidden'}"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="w-full max-w-xl rounded-lg border border-input bg-background p-6 shadow-lg"
            transition:scale={{ duration: 200 }}
        >
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold">Share this game! 🌟</h2>
                <button
                    class="rounded-full p-2 hover:bg-secondary/30"
                    onclick={() => (showShareDialog = false)}
                >
                    ✕
                </button>
            </div>

            <div class="screenshot-target flex flex-col gap-3 bg-background p-2">
                <span
                    class="px-2 text-left text-xl font-bold text-foreground {isCapturing
                        ? '-translate-y-2'
                        : ''}"
                >
                    {title}
                </span>
                <div class="flex flex-col items-center gap-3">
                    <!-- Add 4x4 Grid -->
                    <div class="grid w-full grid-cols-4 gap-2 rounded-lg bg-secondary/20 p-4">
                        {#each Array(4) as _, row}
                            {#each Array(4) as _, col}
                                {@const cell = cells[row * 4 + col]}
                                <div
                                    class="flex items-center justify-center rounded border border-input/20 bg-secondary
                                           p-2 text-center text-sm font-medium
                                           {cell.isUsed ? 'opacity-50' : ''}
                                           {cell.isSelected ? 'ring-2 ring-accent' : ''}"
                                >
                                    <span
                                        class="flex items-center justify-center text-lg font-bold
                                            {isCapturing ? '-translate-y-2' : ''}
                                        "
                                    >
                                        {cell.word}</span
                                    >
                                </div>
                            {/each}
                        {/each}
                    </div>
                    <div class="flex w-full gap-2">
                        <button
                            onclick={handleCopy}
                            type="text"
                            class="flex w-full items-center justify-center rounded-sm border border-input/50 bg-accent/90 px-2 py-1 text-sm font-bold text-background ring-0 focus:ring-0
                           
                            "
                        >
                            <span class="   {isCapturing ? '-translate-y-2' : ''}">
                                {window.location.href}
                            </span>
                        </button>
                        <button
                            onclick={handleScreenshot}
                            class="rounded-lg border border-input/50 bg-secondary/20 p-2"
                        >
                            <Camera size="24" strokeWidth="2.5" class="text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .screenshot-target {
        font-family:
            'YourFontFamily',
            system-ui,
            -apple-system,
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* Add these properties to help with text positioning */
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        /* Ensure proper line height */
        line-height: normal;
    }

    /* Ensure all text elements within the screenshot have explicit line height */
    .screenshot-target * {
        line-height: normal;
        position: relative;
    }

    /* Add specific adjustments for text elements if needed */
    .screenshot-target .text-sm {
        line-height: 1.2;
    }

    .screenshot-target .text-lg {
        line-height: 1.4;
    }

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
