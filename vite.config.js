import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    build: {
        sourcemap: true,
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    styles: ['src/app.css']
                }
            }
        }
    },
    resolve: {
        alias: {
            $lib: '/src/lib',
            $assets: '/src/assets'
        }
    },
    server: {
        fs: {
            allow: ['.']
        }
    }
});
