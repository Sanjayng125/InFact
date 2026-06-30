import { redis } from "./redis";

export async function checkUsageLimit(userId: string, limit: number, isPro: boolean): Promise<{
    allowed: boolean;
    remaining: number;
    resetIn: number;
}> {
    const key = `infact:usage:${userId}:${new Date().toISOString().split("T")[0]}`;

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, 60 * 60 * 24);
    }

    const ttl = await redis.ttl(key);

    if (current > limit) {
        return { allowed: false, remaining: 0, resetIn: ttl };
    }

    return { allowed: true, remaining: limit - current, resetIn: ttl };
}
