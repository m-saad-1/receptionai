import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled error:', err?.message || err);
  console.error('Stack:', err?.stack);
  res.status(500).json({ error: 'SERVER_ERROR', message: err?.message || 'An unexpected error occurred' });
}
