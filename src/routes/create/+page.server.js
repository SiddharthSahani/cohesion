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
        const title = formData.get('title');
        const clustersData = [];

        for (let i = 0; formData.has(`cluster-${i}-word-0`); i++) {
            const cluster = {
                words: [
                    formData.get(`cluster-${i}-word-0`) || '',
                    formData.get(`cluster-${i}-word-1`) || '',
                    formData.get(`cluster-${i}-word-2`) || '',
                    formData.get(`cluster-${i}-word-3`) || ''
                ],
                context: formData.get(`cluster-${i}-context`) || ''
            };
            clustersData.push(cluster);
        }

        try {
            // If you want to actually create the game, uncomment this
            const gameId = await createGame(session.user.email, {
                title,
                clusters: clustersData
            });

            // Use throw redirect with 303 status
            throw redirect(303, `/games/${gameId}`);
        } catch (error) {
            // If it's not a redirect error, handle it
            if (error.status !== 303) {
                console.error('Game creation error:', error);
                return fail(500, {
                    message: 'Failed to create game',
                    title,
                    clusters: clustersData
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
