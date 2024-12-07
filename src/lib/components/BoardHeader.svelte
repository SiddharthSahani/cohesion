<script>
    import { Info, Shuffle } from 'lucide-svelte';
    import SubmitButton from './SubmitButton.svelte';

    let { shuffleBoardFn, submitEnable, submitFn } = $props();
</script>

<div
    class="text-md flex w-full select-none justify-between px-4 pb-2 font-bold text-white sm:text-lg"
>
    <div
        class="hidden w-auto items-center justify-center gap-2 rounded-lg border-2 border-tertiary bg-secondary px-4 opacity-75 sm:flex"
    >
        <Info size="24" strokeWidth="3" class="text-primary" />
        Group Similar Items
    </div>
    <div class="flex gap-2">
        <button
            onclick={shuffleBoardFn}
            class="hover:rotate-5 flex aspect-square h-full items-center justify-center rounded-lg border-2 border-accent/10 bg-tertiary p-2
                   text-primary transition-all duration-300
                   ease-in-out hover:scale-105 hover:bg-primary/10
                   active:scale-95"
        >
            <Shuffle size="24" strokeWidth="3" />
        </button>
        <SubmitButton {submitFn} enable={submitEnable} />
    </div>
</div>
