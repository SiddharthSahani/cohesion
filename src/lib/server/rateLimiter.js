class RateLimiter {
    constructor(windowMs = 60 * 60 * 1000, maxRequests = 5) {
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
        this.requests = new Map();

        // Clean up old entries every hour
        setInterval(() => this.cleanup(), windowMs);
    }

    cleanup() {
        const now = Date.now();
        for (const [key, data] of this.requests.entries()) {
            if (now - data.windowStart > this.windowMs) {
                this.requests.delete(key);
            }
        }
    }

    isRateLimited(key) {
        const now = Date.now();
        const userRequests = this.requests.get(key) || {
            count: 0,
            windowStart: now
        };

        // Reset if window has expired
        if (now - userRequests.windowStart > this.windowMs) {
            userRequests.count = 0;
            userRequests.windowStart = now;
        }

        // Check if rate limited
        if (userRequests.count >= this.maxRequests) {
            return {
                limited: true,
                resetAt: new Date(userRequests.windowStart + this.windowMs)
            };
        }

        // Increment counter
        userRequests.count++;
        this.requests.set(key, userRequests);

        return { limited: false };
    }
}

// Create a single instance to be shared across requests
export const rateLimiter = new RateLimiter();
