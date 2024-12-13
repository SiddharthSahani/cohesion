import { json } from '@sveltejs/kit';
import { submitReport } from '$lib/server/flag';
import { rateLimiter } from '$lib/server/rateLimiter';

export async function POST({ request, getClientAddress }) {
    try {
        const data = await request.json();
        const clientIp = getClientAddress();
        const identifier = data.user?.email || clientIp || 'anonymous';

        // Check rate limit using the shared instance
        const rateLimitResult = rateLimiter.isRateLimited(identifier);
        if (rateLimitResult.limited) {
            return json(
                {
                    error: 'Rate limit exceeded',
                    resetAt: rateLimitResult.resetAt
                },
                { status: 429 }
            );
        }

        const result = await submitReport(data);

        if (!result.success) {
            return json({ error: result.message }, { status: 500 });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error processing report:', error);
        return json(
            {
                error: 'Internal server error'
            },
            { status: 500 }
        );
    }
}
