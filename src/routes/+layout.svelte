<script>
    import { Sun } from 'lucide-svelte';
    import '../app.css';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
    import CohesionLogo from '$lib/components/CohesionLogo.svelte';
    import { page } from '$app/stores';
    let { children } = $props();
</script>

<div
    class="flex h-full w-full flex-col justify-between overflow-hidden bg-background text-foreground"
>
    <div class="flex items-center justify-between px-6 py-4">
        <a href="/"> <CohesionLogo /></a>
        <ThemeSwitch />
    </div>

    <div class="flex flex-grow items-center justify-center overflow-auto">
        {@render children()}
    </div>

    {#if $page.url.pathname.startsWith('/games')}
        <div class="w-full bg-yellow-500 text-center text-lg font-medium text-black underline">
            <a href="/create">Want one of your own?</a>
        </div>
    {/if}
</div>
