import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    // Development mode: skip JWT verification if token is 'mock-token-for-dev'
    if (token === 'mock-token-for-dev' && process.env.NODE_ENV !== 'production') {
      req.userId = 'user-123';
      logger.info('Development mode: Using mock authentication');
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;

    // TODO: Fetch user from database and attach to request
    // req.user = await User.findById(decoded.userId);

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

