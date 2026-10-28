import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  role: 'admin' | 'employee';
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication token is required' });
    return;
  }

  const token = authorization.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    res.status(401).json({ message: 'Invalid authentication configuration or token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== 'object' ||
      !decoded ||
      typeof decoded.userId !== 'string' ||
      (decoded.role !== 'admin' && decoded.role !== 'employee')
    ) {
      res.status(401).json({ message: 'Invalid authentication token' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
};