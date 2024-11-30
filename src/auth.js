import { SvelteKitAuth } from '@auth/sveltekit';
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import Google from '@auth/sveltekit/providers/google';

console.log('Redis URL:', env.UPSTASH_REDIS_URL);
console.log('Redis Token:', env.UPSTASH_REDIS_TOKEN);

const redis = new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN
});

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: UpstashRedisAdapter(redis),
    providers: [Google]
});
