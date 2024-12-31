import { incrementPlayCount, incrementWinCount } from '$lib/server/redis';
import { json } from '@sveltejs/kit';

export async function POST({ params, request }) {
    const { gameId, gameTitle } = await request.json();

    try {
        if (params.action === 'play') {
            await incrementPlayCount(gameId, gameTitle);
        } else if (params.action === 'win') {
            await incrementWinCount(gameId);
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error updating count:', error);
        return json({ success: false, error: error.message }, { status: 500 });
    }
}
