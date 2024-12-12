<script>
    import { Sun, Moon } from 'lucide-svelte';
    import { browser } from '$app/environment';

    let darkMode = $state(true);

    function handleSwitchDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        darkMode
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
    }

    if (browser) {
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
            darkMode = true;
        } else {
            document.documentElement.classList.remove('dark');
            darkMode = false;
        }
    }
</script>

<div class="flex aspect-square h-full items-center justify-center">
    <input checked={darkMode} onclick={handleSwitchDarkMode} type="checkbox" id="theme-toggle" />
    <label for="theme-toggle" class="flex h-full w-full items-center">
        {#if darkMode}
            <Moon class="icon" />
        {:else}
            <Sun class="icon" />
        {/if}
    </label>
</div>

<style lang="postcss">
    #theme-toggle {
        @apply invisible absolute;
    }

    #theme-toggle + label {
        @apply flex aspect-square cursor-pointer items-center justify-center rounded-full bg-secondary/50 p-2 duration-300 hover:bg-secondary/75;
    }
</style>
