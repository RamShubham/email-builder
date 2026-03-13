import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 5 * 60 * 1000;
const WINDOW_MS = 60 * 1000;

const DEFAULT_LIMIT = 60;
const AI_LIMIT = 10;

const AI_PATHS = ['/chat', '/chat/stream', '/image/generate'];

function getWhitelistedIPs(): Set<string> {
  const raw = process.env.RATE_LIMIT_WHITELIST_IPS || '';
  return new Set(raw.split(',').map((ip) => ip.trim()).filter(Boolean));
}

function getClientIP(req: Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function cleanup() {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

setInterval(cleanup, CLEANUP_INTERVAL);

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIP = getClientIP(req);

  const whitelist = getWhitelistedIPs();
  if (whitelist.has(clientIP)) {
    return next();
  }

  const isAIPath = AI_PATHS.some((p) => req.path === p);
  const limit = isAIPath ? AI_LIMIT : DEFAULT_LIMIT;
  const key = isAIPath ? `ai:${clientIP}` : `api:${clientIP}`;

  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000);

    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter,
    });
  }

  entry.timestamps.push(now);
  next();
}
