import { getUserGames, deleteGame } from '$lib/server/redis';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const session = await locals.getSession();
    if (!session?.user) {
        return { games: [] }; // Return empty games array for unauthenticated users
    }
    const games = await getUserGames(session.user.email);
    return { games };
};

export const actions = {
    deleteGame: async ({ request, locals }) => {
        const session = await locals.getSession();
        if (!session?.user) {
            return fail(401, { message: 'You must be logged in to delete a game' });
        }

        try {
            const formData = await request.formData();
            const gameId = formData.get('gameId');
            const gameTitle = formData.get('gameTitle');
            const userId = session.user.email;

            if (!gameId) {
                return fail(400, { message: 'Game ID is required' });
            }

            await deleteGame(userId, gameId, gameTitle);
            return { success: true, gameId };
        } catch (error) {
            return fail(500, { message: 'Failed to delete game' });
        }
    }
};
