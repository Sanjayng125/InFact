import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const factCheckRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "30s"),
    prefix: "infact:fact-check",
    analytics: true,
});

export const uploadRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60s"),
    prefix: "infact:upload",
    analytics: true,
});

export const checkoutRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1, "10s"),
    prefix: "infact:checkout",
    analytics: true,
});
