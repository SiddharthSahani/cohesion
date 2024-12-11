<script>
    import { toast } from 'svelte-sonner';
</script>

<button
    class="rounded-md bg-primary px-4 py-2 text-white"
    on:click={() => {
        toast.error('Hello, world!');
    }}
>
    Click me
</button>
