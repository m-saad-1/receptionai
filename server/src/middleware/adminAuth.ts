import { Request, Response, NextFunction } from 'express';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token'];
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'secret';

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or missing admin token' });
  }

  next();
}
