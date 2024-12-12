<script>
    import CohesionLogo from '$lib/components/CohesionLogo.svelte';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
    import { page } from '$app/stores';

    let imageError = $state(false);

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
            <a class="relative h-10 w-10 select-none" href="/profile">
                <img
                    class="aspect-square h-full w-12 rounded-full object-cover {imageError
                        ? 'hidden'
                        : ''}"
                    src={$page.data.session.user.image}
                    alt="Profile picture of {$page.data.session.user.name || 'user'}"
                    onerror={handleImageError}
                    loading="eager"
                    decoding="async"
                />

                {#if imageError}
                    <div
                        class="flex h-full w-full items-center justify-center rounded-full bg-tertiary/50 text-xl font-bold uppercase"
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
