import { queryGames } from '$lib/server/redis';

export const load = async ({ params }) => {
    console.log('fetching trending boards');

    const data = await queryGames({ limit: 100 });
    const boards = data.map((game) => ({
        id: game.id,
        name: game.title,
        timesPlayed: game.playCount,
        flair: game.flair || 'none'
    }));
    return { boards };
};
