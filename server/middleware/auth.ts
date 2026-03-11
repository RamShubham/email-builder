import type { Request, Response, NextFunction } from 'express';

const PUBLIC_PREFIXES = ['/health', '/embed', '/assets'];

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (PUBLIC_PREFIXES.some((p) => req.path.startsWith(p))) return next();

  const validKeys = (process.env.TINYEMAIL_API_KEYS || '').split(',').filter(Boolean);
  if (validKeys.length === 0) return next();

  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token is required' });
  }

  next();
}
