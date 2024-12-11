<script>
    import { Toaster as Sonner } from 'svelte-sonner';
    import { mode } from 'mode-watcher';

    let restProps = $props();
</script>

<Sonner
    theme={$mode}
    class="toaster group"
    toastOptions={{
        classes: {
            toast: 'group toast group-[.toaster]:bg-error group-[.toaster]:text-error-foreground group-[.toaster]:border-error-foreground group-[.toaster]:border-[1.25px] group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
        }
    }}
    {...restProps}
/>
