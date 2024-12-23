import { queryGames } from '$lib/server/redis';

export const load = async ({ params }) => {
    console.log('fetching trending boards');

    const boards = (await queryGames({ sortBy: 'playCount', order: 'desc', limit: 10 })).map(
        (game) => ({
            id: game.id,
            name: game.title,
            timesPlayed: game.playCount,
            flair: game.flair || 'none'
        })
    );
    return { boards };
};
