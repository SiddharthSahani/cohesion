import { getGame } from '$lib/server/redis';

export const load = async ({ params }) => {
    try {
        // Fetch game details from Redis
        const game = await getGame(params.game_id);

        return {
            board_title: game.title + ' - Board',
            cells: game.clusters.flatMap((cluster) => cluster.words)
        };
    } catch (error) {
        console.error('Error fetching game:', error);
        return {
            board_title: 'Game not found',
            cells: []
        };
    }
};
