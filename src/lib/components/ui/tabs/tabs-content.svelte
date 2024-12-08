<script>
    import { Tabs as TabsPrimitive } from 'bits-ui';
    import { cn } from '$lib/utils.js';

    let { ref = $bindable(null), class: className, ...restProps } = $props();
</script>

<TabsPrimitive.Content
    bind:ref
    class={cn(
        'mt-2 ring-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2',
        className
    )}
    {...restProps}
/>
