import type { Request, Response, NextFunction } from 'express';

const PUBLIC_PREFIXES = ['/health', '/embed', '/assets'];

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[auth] path="${req.path}" method=${req.method}`);
  if (PUBLIC_PREFIXES.some((p) => req.path.startsWith(p))) {
    console.log('[auth] public path, skipping');
    return next();
  }

  const validKeys = (process.env.TINYEMAIL_API_KEYS || '').split(',').filter(Boolean);
  console.log(`[auth] validKeys.length=${validKeys.length} tokenPresent=${!!req.headers.token}`);
  if (validKeys.length === 0) return next();

  const authHeader = req.headers.token;
  if (!authHeader) {
    console.log('[auth] 401 - no token header');
    return res.status(401).json({ error: 'Token is required' });
  }

  next();
}
