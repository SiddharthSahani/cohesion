<script>
    import { page } from '$app/stores';
    import CohesionLogo from '$lib/components/CohesionLogo.svelte';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';

    let imageLoaded = false;
    let imageError = false;

    function handleImageLoad() {
        imageLoaded = true;
    }

    function handleImageError() {
        imageError = true;
    }
</script>

<div class="flex items-center justify-between px-6 py-4">
    <a href="/" aria-label="Home">
        <CohesionLogo />
    </a>
    <div class="flex items-center gap-2">
        <ThemeSwitch />

        {#if $page.data.session}
            <a class="relative h-12 w-12 select-none" href="/profile">
                <img
                    class="aspect-square h-full w-12 rounded-full object-cover {imageError
                        ? 'hidden'
                        : ''}"
                    src={$page.data.session.user.image}
                    alt="Profile picture of {$page.data.session.user.name || 'user'}"
                    on:load={handleImageLoad}
                    on:error={handleImageError}
                    loading="eager"
                    decoding="async"
                />

                {#if imageError}
                    <div
                        class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xl font-bold uppercase"
                    >
                        {$page.data.session.user.name?.[0] || '?'}
                    </div>
                {/if}
            </a>
        {:else}
            <a href="/create" class="text-foreground">Create Cohesions</a>
        {/if}
    </div>
</div>
