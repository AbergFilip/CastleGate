import { Request, Response, NextFunction } from 'express';

type RateEntry = {
  count: number;
  resetAt: number;
};

const globalStore = new Map<string, RateEntry>();
const authStore = new Map<string, RateEntry>();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '200', 10);

const AUTH_WINDOW_MS = 60_000;
const AUTH_MAX_REQUESTS = 20;

const SENSITIVE_AUTH_PATHS = [
  '/api/v1/auth/issue',
  '/api/v1/auth/refresh',
  '/api/v1/bankid/auth',
  '/api/v1/bankid/signup',
  '/api/v1/bankid/signin',
  '/api/v1/bankid/link',
];

function checkRate(
  store: Map<string, RateEntry>,
  key: string,
  windowMs: number,
  maxReqs: number,
  req: Request,
  res: Response,
): boolean {
  const now = Date.now();
  const existing = store.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + windowMs;
  }

  existing.count += 1;
  store.set(key, existing);

  const remaining = Math.max(0, maxReqs - existing.count);
  res.setHeader('X-RateLimit-Limit', maxReqs.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.round(existing.resetAt / 1000).toString());

  if (existing.count > maxReqs) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    const traceId = (req as any).traceId;
    res.setHeader('Retry-After', retryAfterSeconds.toString());
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        traceId,
      },
      meta: { retryAfterSeconds },
    });
    return false;
  }
  return true;
}

export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const key =
    req.ip ||
    (req.connection && (req.connection as any).remoteAddress) ||
    'global';

  const isSensitiveAuth = SENSITIVE_AUTH_PATHS.some((p) => req.path === p);

  if (isSensitiveAuth) {
    if (!checkRate(authStore, key, AUTH_WINDOW_MS, AUTH_MAX_REQUESTS, req, res)) return;
  }

  if (!checkRate(globalStore, key, WINDOW_MS, MAX_REQUESTS, req, res)) return;

  next();
}


