<script>
    import { Sun } from 'lucide-svelte';
    import '../app.css';
    import CohesionLogo from '../components/CohesionLogo.svelte';
    let { children } = $props();
</script>

<div class="flex h-full w-full flex-col justify-between bg-background p-4">
    <div class="flex justify-between">
        <CohesionLogo />
        <button onclick={() => alert('flashbang ')} class="rounded-lg bg-tertiary p-1 text-primary">
            <Sun size={32} strokeWidth={2} />
        </button>
    </div>
    <div class="flex h-full flex-col items-center justify-center">
        {@render children()}
    </div>
    <div class="w-full text-center text-3xl font-bold text-white underline">
        Want one of your own ?
    </div>
</div>
