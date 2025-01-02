<script>
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { cn } from '$lib/utils.js';

    let { ref = $bindable(null), class: className, children, ...restProps } = $props();
</script>

<AccordionPrimitive.Content
    bind:ref
    class={cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
    )}
    {...restProps}
>
    <div class="pb-4 pt-0">
        {@render children?.()}
    </div>
</AccordionPrimitive.Content>
