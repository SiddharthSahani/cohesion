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

<div>
    <input checked={darkMode} onclick={handleSwitchDarkMode} type="checkbox" id="theme-toggle" />
    <label for="theme-toggle">
        {#if darkMode}
            <Moon class="icon" />
        {:else}
            <Sun class="icon" />
        {/if}
    </label>
</div>

<style lang="postcss">
    #theme-toggle {
        @apply invisible;
    }

    #theme-toggle + label {
        @apply flex h-12 w-12 cursor-pointer rounded-full duration-300;
    }
</style>
