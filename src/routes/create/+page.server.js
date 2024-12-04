// src/routes/games/create/+page.server.js
import { createGame } from '$lib/server/redis';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        // Validate session
        const session = await locals.getSession();
        if (!session?.user) {
            return fail(401, { message: 'You must be logged in to create a game' });
        }

        const formData = await request.formData();

        const title = formData.get('title').trim();
        if (!title) {
            return fail(401, { message: 'Game title is required' });
        }

        const clusters = [];
        for (let i = 0; i < 4; i++) {
            const words = [];
            for (let j = 0; j < 4; j++) {
                const word = formData.get(`cluster-${i}-word-${j}`).trim();
                if (!word) {
                    return fail(401, {
                        message: "Didn't provide word " + (j + 1) + ' for cluster ' + (i + 1)
                    });
                }
                words.push(word);
            }
            const context = formData.get(`cluster-${i}-context`).trim();
            if (!context) {
                return fail(401, { message: "Didn't provide context for cluster " + (i + 1) });
            }

            clusters.push({
                words,
                context
            });
        }

        try {
            // If you want to actually create the game, uncomment this
            const gameId = await createGame(session.user.email, { title, clusters });

            // Use throw redirect with 303 status
            throw redirect(303, `/games/${gameId}`);
        } catch (error) {
            // If it's not a redirect error, handle it
            if (error.status !== 303) {
                console.error('Game creation error:', error);
                return fail(500, {
                    message: 'Failed to create game',
                    title,
                    clusters
                });
            }
            // Re-throw redirect
            throw error;
        }
    }
};

// Optional: Add a load function if you want to fetch any initial data
export async function load(event) {
    const session = await event.locals.getSession();
    return { session };
}
