import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import { customAlphabet } from 'nanoid';

const redis = new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN
});

export function generateCleanGameId() {
    // Use a custom alphabet that excludes similar-looking characters
    const nanoid = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyz',
        10 // 10 character length
    );

    return nanoid();
}

/**
 * Create a new game
 * @param {string} userId - ID of the user creating the game
 * @param {Object} gameData - Game details
 * @returns {Promise<string>} - Created game ID
 */
export async function createGame(userId, gameData) {
    // Validate input
    if (!userId) throw new Error('User ID is required');

    // Generate a unique game ID
    const gameId = generateCleanGameId();

    // Prepare game object
    const game = {
        id: gameId,
        userId,
        title: gameData.title,
        flair: gameData.flair,
        createdAt: new Date().toISOString(),
        playCount: 0,
        winCount: 0,
        clusters: gameData.clusters
    };

    // Store game in Redis
    await redis.hmset(`game:${gameId}`, game);

    // Create a user-to-games index
    await redis.sadd(`user:${userId}:games`, gameId);

    // adding to sorted set
    await redis.zadd(`trending`, {
        score: 0,
        member: {
            id: gameId,
            title: gameData.title
        }
    });

    return gameId;
}

/**
 * Query games for a specific user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - List of user's games
 */
export async function getUserGames(userId) {
    // Get all game IDs for the user
    const gameIds = await redis.smembers(`user:${userId}:games`);

    // Fetch details for each game
    const games = await Promise.all(
        gameIds.map(async (gameId) => {
            return await redis.hgetall(`game:${gameId}`);
        })
    );

    return games;
}

/**
 * Query all games sorted by different criteria
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Sorted list of games
 */
export async function queryGames(options = {}) {
    const { limit = 10, flair } = options;

    const trendingGames = await redis.zrange('trending', 0, -1, {
        withScores: true,
        rev: true,
        count: limit
    });

    const ret = [];
    for (let i = 0; i < trendingGames.length; i += 2) {
        const { id, title } = trendingGames[i];
        if (!id || id == '') continue;
        const score = trendingGames[i + 1];
        ret.push({
            id,
            title,
            playCount: score
        });
    }

    return ret;
}

/**
 * Delete a game
 * @param {string} userId - ID of the user deleting the game
 * @param {string} gameId - ID of the game to delete
 */
export async function deleteGame(userId, gameId, gameTitle) {
    // Validate input
    if (!userId || !gameId) throw new Error('User ID and Game ID are required');

    // Remove game from user's game list
    await redis.srem(`user:${userId}:games`, gameId);

    // Delete the game
    await redis.del(`game:${gameId}`);

    // removing from sorted sets
    await redis.zrem(`trending`, {
        id: gameId,
        title: gameTitle
    });
}

/**
 * Increment play count for a game
 * @param {string} gameId - ID of the game
 */
export async function incrementPlayCount(gameId, gameTitle) {
    await redis.hincrby(`game:${gameId}`, 'playCount', 1);
    await redis.zincrby(`trending`, 1, {
        id: gameId,
        title: gameTitle
    });
}

/**
 * Increment win count for a game
 * @param {string} gameId - ID of the game
 */
export async function incrementWinCount(gameId) {
    await redis.hincrby(`game:${gameId}`, 'winCount', 1);
}

/**
 * Get details of a specific game
 * @param {string} gameId - ID of the game
 * @returns {Promise<Object>} - Game details
 */
export async function getGame(gameId) {
    // Validate input
    if (!gameId) throw new Error('Game ID is required');

    // Fetch game details from Redis
    const game = await redis.hgetall(`game:${gameId}`);
    if (!game) {
        throw new Error('Game not found');
    }

    return game;
}

/**
 * Search games by title
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of games
 */
export async function searchGames(query) {
    // Get all game keys
    const allGameKeys = await redis.keys('game:*');

    // Fetch game details
    const games = await Promise.all(
        allGameKeys.map(async (key) => {
            return await redis.hgetall(key);
        })
    );

    // Filter games by title
    return games.filter((game) => game.title.toLowerCase().includes(query.toLowerCase()));
}
