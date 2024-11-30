export const load = async ({ params }) => {
    // TODO: fetch from redis here
    // this runs on server

    console.log('fetching trending boards');
    return {
        boards: [
            { id: 'hello', name: 'Food', timesPlayed: 268 },
            { id: 'testing', name: 'Country', timesPlayed: 210 },
            { id: 'another', name: 'Game', timesPlayed: 169 },
            { id: 'more', name: 'Tech', timesPlayed: 166 },
            { id: 'happy', name: 'Music', timesPlayed: 152 }
        ]
    };
};
