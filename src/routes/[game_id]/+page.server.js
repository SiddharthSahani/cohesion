export const load = async ({ params }) => {
    // TODO: fetch from redis here
    // this runs on server

    console.log('fetching', params.game_id);
    return {
        board_title: params.game_id + ' - Board',
        cells: [
            'Pickaxe',
            'Obsidian',
            'Steve',
            'Alex',
            'Ammo',
            'Tree',
            'Tycoon',
            'Fantasy',
            'Steak',
            'Zombie',
            'Catapult',
            'Buggy',
            'Mushroom',
            'Racing',
            'Wood',
            'Pigs'
        ]
    };
};
