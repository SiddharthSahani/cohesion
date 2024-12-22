<script>
    import { page } from '$app/stores';
</script>

<main class="container flex min-h-full flex-col items-center justify-center px-4 py-12">
    <h1 class="text-5xl font-bold text-accent md:text-7xl">
        {$page.status}
    </h1>
    <div>
        <p class="text-base-content/80 md:text-md mb-6 text-center text-sm font-medium">
            {#if $page.status === 404}
                PAGE NOT FOUND
            {:else}
                UNEXPECTED ERROR
            {/if}
        </p>
        <p>
            <a href="/" class="rounded bg-accent px-2 py-2 font-bold text-background"
                >Go back home</a
            >
        </p>
    </div>
</main>
