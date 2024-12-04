<script>
    import { Sun } from 'lucide-svelte';
    import '../app.css';
    import CohesionLogo from '../components/CohesionLogo.svelte';
    let { children } = $props();
</script>

<div class="flex h-full w-full flex-col justify-between overflow-hidden bg-background">
    <div class="flex items-center justify-between p-4">
        <CohesionLogo />
        <button onclick={() => alert('flashbang')} class="rounded-lg bg-tertiary p-2 text-primary">
            <Sun size={24} strokeWidth={2} />
        </button>
    </div>

    <div class="flex flex-grow items-center justify-center overflow-auto">
        {@render children()}
    </div>

    <div class="w-full bg-yellow-500 text-center text-lg font-medium text-black underline">
        <a href="/create">Want one of your own?</a>
    </div>
</div>
