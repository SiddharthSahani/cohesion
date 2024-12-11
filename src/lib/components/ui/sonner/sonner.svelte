<script lang="ts">
    import { Toaster as Sonner } from 'svelte-sonner';
    import { mode } from 'mode-watcher';
    import { page } from '$app/stores';

    let restProps = $props();

    let isGamePath = $derived($page.url.pathname.startsWith('/games/'));

    const toastClasses = $derived(
        isGamePath
            ? {
                  toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-secondary/75 group-[.toaster]:shadow-md',
                  description: 'group-[.toast]:text-muted-foreground',
                  actionButton:
                      'group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground',
                  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
              }
            : {
                  toast: 'group toast group-[.toaster]:bg-error group-[.toaster]:text-error-foreground group-[.toaster]:border-error-foreground group-[.toaster]:border-[1.25px] group-[.toaster]:shadow-lg',
                  description: 'group-[.toast]:text-muted-foreground',
                  actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
              }
    );
</script>

<Sonner
    theme={$mode}
    class="toaster group"
    toastOptions={{
        classes: toastClasses
    }}
    {...restProps}
/>
