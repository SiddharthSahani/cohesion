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
    const { sortBy = 'createdAt', order = 'desc', limit = 10, flair } = options;

    // Get all game keys
    const allGameKeys = await redis.keys('game:*');

    // Fetch game details

    const games = await Promise.all(
        allGameKeys.map(async (key) => {
            return await redis.hgetall(key);
        })
    );

    // Sort games
    games.sort((a, b) => {
        if (a.sortBy < b.sortBy) {
            return order === 'asc' ? -1 : 1;
        }
        if (a.sortBy > b.sortBy) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Filter games by flair
    if (flair) {
        return games.filter((game) => game.flair === flair);
    }

    // Limit games
    return games.slice(0, limit);
}

/**
 * Update an existing game
 * @param {string} gameId - ID of the game to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated game
 */
export async function updateGame(gameId, updateData) {
    // Validate input
    if (!gameId) throw new Error('Game ID is required');

    // Update game in Redis
    await redis.hmset(`game:${gameId}`, {
        ...updateData,
        updatedAt: new Date().toISOString()
    });

    // Return updated game
    return await redis.hgetall(`game:${gameId}`);
}

/**
 * Delete a game
 * @param {string} userId - ID of the user deleting the game
 * @param {string} gameId - ID of the game to delete
 */
export async function deleteGame(userId, gameId) {
    // Validate input
    if (!userId || !gameId) throw new Error('User ID and Game ID are required');

    // Remove game from user's game list
    await redis.srem(`user:${userId}:games`, gameId);

    // Delete the game
    await redis.del(`game:${gameId}`);
}

/**
 * Increment play count for a game
 * @param {string} gameId - ID of the game
 */
export async function incrementPlayCount(gameId) {
    await redis.hincrby(`game:${gameId}`, 'playCount', 1);
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
    console.log('allGameKeys:', allGameKeys);
    // Fetch game details
    const games = await Promise.all(
        allGameKeys.map(async (key) => {
            return await redis.hgetall(key);
        })
    );
    console.log('games:', games);

    // Filter games by title
    return games.filter((game) => game.title.toLowerCase().includes(query.toLowerCase()));
}
