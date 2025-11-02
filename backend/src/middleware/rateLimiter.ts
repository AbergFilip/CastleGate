import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

const generalRateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per duration in seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await generalRateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes) {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  }
};

// Strict rate limiter for authentication endpoints
const authRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 900, // 15 minutes
});

export const authRateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authRateLimiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes) {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again in 15 minutes'
    });
  }
};

// Export rateLimiter for default use
export const rateLimiter = rateLimiterMiddleware;

