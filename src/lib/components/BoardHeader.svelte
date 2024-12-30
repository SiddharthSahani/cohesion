<script>
    import posthog from 'posthog-js';
    import { fade } from 'svelte/transition';
    import { scale } from 'svelte/transition';
    import SubmitButton from './SubmitButton.svelte';
    import { Info, Shuffle, AlertTriangle, Share2, Camera, Link } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { page } from '$app/stores';
    import html2canvas from 'html2canvas';

    let { shuffleBoardFn, submitEnable, submitFn, cells, title } = $props();
    let showReportDialog = $state(false);
    let showShareDialog = $state(false);
    let selectedReason = $state('');
    let isSubmitting = $state(false);
    let isCapturing = $state(false);
    let overlayVisible = $state(false);
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
            overlayVisible = true;
            const element = document.querySelector('.screenshot-target');

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

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('.screenshot-target');
                    if (clonedElement) {
                        clonedElement.style.backgroundColor = getComputedStyle(
                            document.body
                        ).backgroundColor;
                    }
                }
            });

            const padding = 20;
            const paddedCanvas = document.createElement('canvas');
            paddedCanvas.width = canvas.width + padding * 2;
            paddedCanvas.height = canvas.height + padding * 2;

            const ctx = paddedCanvas.getContext('2d');
            const bgColor = getComputedStyle(document.body).backgroundColor;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            ctx.drawImage(canvas, padding, padding);

            const blob = await new Promise((resolve) => paddedCanvas.toBlob(resolve, 'image/png'));
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            link.click();

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
            overlayVisible = false;
        }
    };

    async function handleReport({ reason }) {
        if (isSubmitting) return;
        isSubmitting = true;
        selectedReason = reason;

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
            showReportDialog = false;
        } catch (error) {
            console.error('Report error:', error);
            toast.error(error.message || 'Failed to submit report');
        } finally {
            isSubmitting = false;
            selectedReason = '';
        }
    }

    function handleShare() {
        showShareDialog = false;
    }
</script>

<!-- Main Controls -->
<div
    class="flex w-full select-none justify-between px-4 pb-2 text-base font-bold text-foreground sm:text-lg"
>
    <div class="flex gap-2">
        <!-- Share Button -->
        <button
            onclick={() => (showShareDialog = true)}
            class="flex w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-200 bg-neutral-100/50 px-4 opacity-75 transition-colors hover:bg-primary/10 dark:border-neutral-700 dark:bg-neutral-800/50 sm:flex"
        >
            <Share2 size="20" strokeWidth="2.5" class="text-primary" />
            <span class="hidden sm:inline">Share</span>
        </button>

        <!-- Report Button -->
        <button
            onclick={() => (showReportDialog = true)}
            class="flex w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-200 bg-neutral-100/50 px-4 opacity-75 transition-colors hover:bg-primary/10 dark:border-neutral-700 dark:bg-neutral-800/50 sm:flex"
        >
            <AlertTriangle size="20" strokeWidth="2.5" class="text-primary" />
            <span class="hidden sm:inline">Report</span>
        </button>
    </div>

    <div class="flex gap-2">
        <!-- Shuffle Button -->
        <button
            onclick={shuffleBoardFn}
            class="flex aspect-square h-full items-center justify-center rounded-lg border-2 border-accent/10 bg-neutral-100/50 p-2 text-primary transition-all duration-300 hover:rotate-3 hover:scale-105 hover:bg-primary/10 active:scale-95 dark:bg-neutral-800/50"
        >
            <Shuffle size="24" strokeWidth="3" />
        </button>
        <SubmitButton {submitFn} enable={submitEnable} />
    </div>
</div>

<!-- Report Dialog -->
{#if showReportDialog}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            transition:scale={{ duration: 200 }}
        >
            <!-- Dialog Header -->
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold">Help Us Improve! 🚀</h2>
                <button
                    class="rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onclick={() => (showReportDialog = false)}
                >
                    ✕
                </button>
            </div>

            <!-- Report Options -->
            <div class="flex flex-col gap-3">
                {#each Object.entries(REPORT_REASONS) as [key, value]}
                    <button
                        class="group relative overflow-hidden rounded-lg border border-neutral-200/50 bg-neutral-100/20 p-4 text-left transition-all hover:border-primary/50 hover:bg-neutral-100/30 disabled:cursor-not-allowed dark:border-neutral-700/50 dark:bg-neutral-800/20 dark:hover:bg-neutral-800/30
                        {selectedReason === key ? 'border-primary bg-primary/10' : ''}"
                        onclick={() => handleReport({ reason: key })}
                        disabled={isSubmitting}
                    >
                        <div class="flex items-center gap-3">
                            <span class="text-2xl transition-transform group-hover:scale-110"
                                >{value.icon}</span
                            >
                            <div>
                                <div class="font-semibold">{value.label}</div>
                                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                                    {value.description}
                                </div>
                            </div>
                        </div>

                        {#if selectedReason === key && isSubmitting}
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-black/50"
                            ></div>
                        {/if}
                    </button>
                {/each}
            </div>

            <div class="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                Your feedback helps make our community better
            </div>
        </div>
    </div>
{/if}
{#if overlayVisible}
    <div
        class="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
        transition:fade={{ duration: 150 }}
    >
        <div
            class="flex h-1/2 w-full max-w-xl items-center justify-center rounded-lg bg-background/90 p-4 shadow-lg backdrop-blur-sm"
        >
            <div class="flex items-center gap-2">
                <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                ></div>
                <span class="text-lg font-bold text-primary">Capturing screenshot...</span>
            </div>
        </div>
    </div>
{/if}
<!-- Share Dialog -->
{#if showShareDialog}
    <div
        class="fixed inset-0 z-50 flex w-full items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="w-full max-w-xl rounded-lg border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            transition:scale={{ duration: 200 }}
        >
            <!-- Dialog Header -->
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold">Share this game! 🌟</h2>
                <button
                    class="rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    onclick={() => (showShareDialog = false)}
                >
                    ✕
                </button>
            </div>

            <!-- Screenshot Content -->
            <div class="screenshot-target flex flex-col gap-3 bg-white p-2 dark:bg-neutral-900">
                <span
                    class="px-2 text-left text-xl font-bold {isCapturing ? '-translate-y-2' : ''}"
                >
                    {title}
                </span>
                <div class="flex flex-col items-center gap-3">
                    <!-- Game Grid -->
                    <div
                        class="grid w-full grid-cols-4 gap-2 rounded-lg bg-neutral-100/20 p-4 dark:bg-neutral-800/20"
                    >
                        {#each Array(4) as _, row}
                            {#each Array(4) as _, col}
                                {@const cell = cells[row * 4 + col]}
                                <div
                                    class="flex items-center justify-center rounded border border-neutral-200/20 bg-neutral-100 p-2 text-center text-sm font-medium dark:border-neutral-700/20 dark:bg-neutral-800
                                 
                                    {cell.isUsed ? 'opacity-50' : ''} 
                                    {cell.isSelected ? 'ring-2 ring-accent' : ''}"
                                >
                                    <span
                                        class="flex items-center justify-center text-lg font-bold {isCapturing
                                            ? '-translate-y-2'
                                            : ''}"
                                    >
                                        {cell.word}
                                    </span>
                                </div>
                            {/each}
                        {/each}
                    </div>

                    <!-- Share Controls -->
                    <div class="flex w-full gap-2 px-4">
                        <button
                            onclick={handleCopy}
                            type="text"
                            class="flex w-full items-center justify-start rounded-sm border border-neutral-200/50 bg-neutral-100/50 px-4 py-1 text-sm font-bold ring-0 focus:ring-0 dark:border-neutral-700/50 dark:bg-neutral-800/50"
                        >
                            <Link
                                size="16"
                                strokeWidth="2.5"
                                class="relative z-30 mr-2 text-primary"
                            />
                            <span class="flex gap-2 {isCapturing ? '-translate-y-2' : ''}">
                                {window.location.host + window.location.pathname}
                            </span>
                        </button>
                        <button
                            onclick={handleScreenshot}
                            class="rounded-lg border border-neutral-200/50 bg-neutral-100/20 p-2 transition-colors hover:bg-neutral-100/30 dark:border-neutral-700/50 dark:bg-neutral-800/20 dark:hover:bg-neutral-800/30"
                        >
                            <Camera size="24" strokeWidth="2.5" class="text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
