<script>
    import posthog from 'posthog-js';
    import { browser } from '$app/environment';
    import { beforeNavigate, afterNavigate } from '$app/navigation';

    import { Sun } from 'lucide-svelte';
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import { Toaster } from '$lib/components/ui/sonner/index.js';
    import { page } from '$app/stores';
    let { children } = $props();

    if (browser) {
        beforeNavigate(() => posthog.capture('$pageleave'));
        afterNavigate(() => posthog.capture('$pageview'));
    }
</script>

<div
    class="flex h-full w-full flex-col justify-between overflow-hidden bg-background text-foreground"
>
    <Navbar />
    <div class="flex flex-grow items-center justify-center overflow-auto">
        <Toaster theme="system" position="bottom-center" />
        {@render children()}
    </div>

    {#if $page.url.pathname.startsWith('/games')}
        <div class="w-full bg-yellow-500 text-center text-lg font-medium text-black underline">
            <a href="/create">Want one of your own?</a>
        </div>
    {/if}
</div>
