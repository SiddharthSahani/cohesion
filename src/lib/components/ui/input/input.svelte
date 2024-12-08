<script>
    import { cn } from '$lib/utils.js';

    let { ref = $bindable(null), value = $bindable(), class: className, ...restProps } = $props();
</script>

<input
    bind:this={ref}
    class={cn(
        'flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
    )}
    bind:value
    {...restProps}
/>
