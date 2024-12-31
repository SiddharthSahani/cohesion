<script>
    import { page } from '$app/stores';

    let isRateLimit = $derived($page.error?.message?.includes('max daily request limit exceeded'));
</script>

<main class="container flex min-h-full flex-col items-center justify-center gap-4 px-4 py-12">
    <h1 class="text-5xl font-bold text-accent md:text-7xl">(◕︵◕)</h1>
    <div>
        <p class="text-base-content/80 mb-6 text-center text-sm font-medium md:text-lg">
            {#if $page.status === 404}
                PAGE NOT FOUND
            {:else if isRateLimit}
                DAILY LIMIT REACHED
            {:else}
                We are undergoing maintainence
            {/if}
        </p>

        {#if isRateLimit}
            <p class="text-base-content/60 mb-6 max-w-md text-center text-sm">
                We've reached our daily request limit. Please try again tomorrow or contact support
                if this persists.
            </p>
        {/if}

        <p class="text-center">
            <!-- <a href="/" class="rounded bg-accent px-2 py-2 font-bold text-background">
                Go back home
            </a> -->
        </p>
    </div>
</main>
