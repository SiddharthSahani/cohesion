import { supabase } from './supabase';
import { fail } from '@sveltejs/kit';

export async function submitReport({ url, reason, user }) {
    try {
        const { error } = await supabase.from('reports').insert([
            {
                url,
                reason,
                reporter: user?.email || 'Anonymous',
                created_at: new Date().toISOString(),
                metadata: {
                    userAgent: user?.userAgent,
                    timestamp: new Date().toISOString()
                }
            }
        ]);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Report submission error:', error);
        return fail(500, {
            success: false,
            message: 'Failed to submit report'
        });
    }
}
