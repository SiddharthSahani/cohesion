<script>
    import SubmitButton from './SubmitButton.svelte';
    import { Info, Shuffle } from 'lucide-svelte';
    import { Share2 } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    let { shuffleBoardFn, submitEnable, submitFn } = $props();

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        toast('Link copied to clipboard', {
            type: 'success',
            duration: 2000
        });
    };
</script>

<div
    class="text-md flex w-full select-none justify-between px-4 pb-2 font-bold text-foreground sm:text-lg"
>
    <button
        onclick={handleCopy}
        class="flex w-auto cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-tertiary bg-secondary/50 px-4 opacity-75 sm:flex"
    >
        <Share2 size="20" strokeWidth="2.5" class="text-primary" />
        Share
    </button>
    <div class="flex gap-2">
        <button
            onclick={shuffleBoardFn}
            class="hover:rotate-5 flex aspect-square h-full items-center justify-center rounded-lg border-2 border-accent/10 bg-secondary/50 p-2
                   text-primary transition-all duration-300
                   ease-in-out hover:scale-105 hover:bg-primary/10
                   active:scale-95"
        >
            <Shuffle size="24" strokeWidth="3" />
        </button>
        <SubmitButton {submitFn} enable={submitEnable} />
    </div>
</div>
