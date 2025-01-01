<!-- PromoButton.svelte -->
<script>
    export let href = "";
    export let type = "button";
    export let disabled = false;
</script>

{#if href}
    <a
        {href}
        class="flex w-full items-center gap-2 rounded-md border border-secondary px-3 py-1 no-underline transition-all hover:bg-secondary/25 md:w-auto"
        target="_blank"
        rel="noopener noreferrer"
    >
        <slot />
    </a>
{:else}
    <button
        {type}
        {disabled}
        on:click
        class="flex items-center gap-2 rounded-md border border-secondary px-2 py-1"
    >
        <slot />
    </button>
{/if}
