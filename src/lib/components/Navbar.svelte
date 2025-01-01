<script>
    import CohesionLogo from '$lib/components/CohesionLogo.svelte';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
    import { page } from '$app/stores';
    import { SignOut } from '@auth/sveltekit/components';
    import * as Popover from "$lib/components/ui/popover/index.js";
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
            <Popover.Root>
                <Popover.Trigger class="h-12 w-12 overflow-hidden rounded-full">
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
                    {/if}</Popover.Trigger
                >
                <Popover.Content class="flex flex-col gap-2">
                    <span class="text-sm font-bold uppercase text-foreground">Account</span>

                    <a
                        class="relative h-auto w-full select-none rounded-md bg-secondary/25 px-4 py-2 text-lg hover:bg-secondary/50"
                        href="/profile"
                        >Profile
                    </a>
                    <SignOut
                        class="relative h-auto w-full select-none rounded-md bg-destructive/10 px-4 py-2 text-lg hover:bg-destructive/15"
                    />
                </Popover.Content>
            </Popover.Root>
        {:else}
            <a
                href="/create"
                class="rounded-sm bg-accent px-4 py-2 font-bold text-foreground dark:text-background max-sm:hidden"
                >Create Cohesions</a
            >
        {/if}
    </div>
</div>
