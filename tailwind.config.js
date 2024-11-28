/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],

    theme: {
        extend: {
            colors: {
                primary: '#BDBAA9',
                secondary: '#292923',
                accent: '#F5AF24',
                background: '#0B0B08',
                tertiary: '#38362C',
                text: '#F2F1EE'
            }
        }
    },

    plugins: []
};
