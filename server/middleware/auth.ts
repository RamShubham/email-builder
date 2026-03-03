import type { Request, Response, NextFunction } from 'express';

const PUBLIC_PREFIXES = ['/api/health', '/embed', '/assets'];

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith('/api/')) return next();
  if (PUBLIC_PREFIXES.some((p) => req.path.startsWith(p))) return next();

  const validKeys = (process.env.TINYEMAIL_API_KEYS || '').split(',').filter(Boolean);
  if (validKeys.length === 0) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'API key required' });
  }

  const key = authHeader.slice(7);
  if (!validKeys.includes(key)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}
