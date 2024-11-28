<script>
    import '../app.css';
    import CohesionLogo from '../components/CohesionLogo.svelte';
    let { children } = $props();
</script>

<div class="flex h-full w-full flex-col justify-between bg-background p-4">
    <CohesionLogo />
    <div class="flex flex-col items-center justify-center">
        {@render children()}
    </div>
    <div class="w-full text-center text-3xl font-bold text-white underline">
        Want one of your own ?
    </div>
</div>
