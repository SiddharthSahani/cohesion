<script>
    import { Info, Shuffle } from 'lucide-svelte';
    import SubmitButton from './SubmitButton.svelte';

    let { shuffleBoardFn, submitFn } = $props();
</script>

<div class="flex w-full justify-between pb-5 text-xl font-bold text-white">
    <div
        class="flex h-12 w-64 items-center justify-center gap-2 rounded-lg border border-white/25 bg-tertiary"
    >
        <Info size="32" strokeWidth="3" class="text-primary" />
        Group Similar Items
    </div>
    <div class="flex gap-3">
        <button
            onclick={shuffleBoardFn}
            class="rounded-lg border border-white/25 bg-tertiary p-2 text-primary"
        >
            <Shuffle size="32" strokeWidth="3" />
        </button>
        <SubmitButton {submitFn} />
    </div>
</div>
