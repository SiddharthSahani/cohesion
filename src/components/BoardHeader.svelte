<script>
    import { Info, Shuffle } from 'lucide-svelte';
    import SubmitButton from './SubmitButton.svelte';

    let { shuffleBoardFn, submitFn } = $props();
</script>

<div class="text-md flex w-full justify-between pb-5 font-bold text-white sm:text-lg">
    <div
        class="flex h-12 w-auto items-center justify-center gap-2 rounded-lg border border-white/25 bg-tertiary px-4"
    >
        <Info size="24" strokeWidth="3" class="text-primary" />
        Group Similar Items
    </div>
    <div class="flex gap-2">
        <button
            onclick={shuffleBoardFn}
            class="h-fll flex aspect-square items-center justify-center rounded-lg border border-white/25 bg-tertiary p-2 text-primary"
        >
            <Shuffle size="24" strokeWidth="3" />
        </button>
        <SubmitButton {submitFn} />
    </div>
</div>
