/**
 * In-memory sliding window rate limiter.
 * No external dependencies — suitable for serverless or single-process deployments.
 */

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

type RateLimitOptions = {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed within the window */
  maxRequests: number;
};

type RateLimiter = {
  check(key: string): RateLimitResult;
};

const store = new Map<string, number[]>();

// Periodic cleanup to avoid unbounded memory growth
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, timestamps] of store.entries()) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      store.set(key, valid);
    }
  }
}

export function rateLimit(options: RateLimitOptions): RateLimiter {
  const { windowMs, maxRequests } = options;

  return {
    check(key: string): RateLimitResult {
      cleanup(windowMs);

      const now = Date.now();
      const cutoff = now - windowMs;
      const timestamps = (store.get(key) ?? []).filter((t) => t > cutoff);

      if (timestamps.length >= maxRequests) {
        const oldestInWindow = timestamps[0] ?? now;
        return {
          allowed: false,
          remaining: 0,
          resetAt: oldestInWindow + windowMs,
        };
      }

      timestamps.push(now);
      store.set(key, timestamps);

      return {
        allowed: true,
        remaining: maxRequests - timestamps.length,
        resetAt: now + windowMs,
      };
    },
  };
}

/**
 * Extract client IP from a request.
 * Checks x-forwarded-for first (reverse proxy), then falls back to a placeholder.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

// ── Pre-configured limiters ──

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  maxRequests: 3,
});

export const supportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});
