export async function incrementPlay(gameId, gameTitle) {
    const response = await fetch('/api/game/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId, gameTitle })
    });

    if (!response.ok) throw new Error('Failed to increment play count');
    return response.json();
}

export async function incrementWin(gameId) {
    const response = await fetch('/api/game/win', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameId })
    });

    if (!response.ok) throw new Error('Failed to increment win count');
    return response.json();
}
