import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimiter() {
  if (!ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    // 5 solicitudes por minuto por IP, ventana deslizante — usado en /api/contact y login.
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "sofdev:ratelimit",
    });
  }
  return ratelimit;
}

export async function checkRateLimit(identifier: string) {
  const limiter = getRatelimiter();
  const { success, remaining, reset } = await limiter.limit(identifier);
  return { success, remaining, reset };
}
