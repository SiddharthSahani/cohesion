import { getUserGames, deleteGame } from '$lib/server/redis';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const session = await locals.getSession();
    if (!session?.user) {
        return fail(401, { message: 'You must be logged in to create a game' });
    }
    const games = await getUserGames(session.user.email);
    return { games };
};

export const actions = {
    deleteGame: async ({ request, locals }) => {
        // Check authentication
        const session = await locals.getSession();
        if (!session?.user) {
            return fail(401, { message: 'You must be logged in to delete a game' });
        }

        try {
            const formData = await request.formData();
            const gameId = formData.get('gameId');
            const userId = session.user.email; // Using email as userId from session

            if (!gameId) {
                return fail(400, { message: 'Game ID is required' });
            }

            await deleteGame(userId, gameId);

            // Fetch updated games list after deletion
            const updatedGames = await getUserGames(userId);

            return {
                success: true,
                games: updatedGames
            };
        } catch (error) {
            console.error('Error deleting game:', error);
            return fail(500, {
                success: false,
                message: 'Failed to delete game'
            });
        }
    }
};
