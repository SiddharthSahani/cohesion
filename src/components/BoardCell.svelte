<script>
    let { text, isSelected, isUsed, selectCellFn } = $props();
</script>

<button
    onclick={selectCellFn}
    class={`text-text flex h-28 w-full items-center justify-center rounded-lg border-[1px] px-4 text-xl font-bold sm:text-2xl ${isSelected ? 'border-accent bg-gradient-to-t from-secondary to-tertiary' : 'border-secondary'} ${isUsed ? 'bg-accent text-black' : 'bg-secondary '}`}
>
    {text}
</button>
