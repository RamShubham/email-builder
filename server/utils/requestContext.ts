import type { Request, Response } from 'express';

export function getToken(req: Request): string | undefined {
  const token = req.headers.token;
  if (!token) return undefined;
  if (Array.isArray(token)) {
    return token[0];
  }
  return token as string;
}

export function requireWorkspaceId(req: Request, res: Response): string | null {
  const { workspaceId } = req.body ?? {};

  if (!workspaceId || typeof workspaceId !== 'string') {
    res.status(400).json({
      error: 'Missing workspace_id parameter',
    });
    return null;
  }

  return workspaceId;
}

