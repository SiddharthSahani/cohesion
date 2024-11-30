import { redirect } from '@sveltejs/kit';

export const load = async (events) => {
    const session = await events.locals.auth();

    // if (!session?.user?.userId) {
    //     redirect(303, `/test`);
    // }

    return {
        session
    };
};
