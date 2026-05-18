import { Request, Response } from 'express';
import { rateLimitMiddleware } from './rate-limit.middleware';

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const AUTH_MAX_REQUESTS = 15;

function createMockReqRes(path: string, ip: string) {
  const req = {
    path,
    ip,
    connection: { remoteAddress: ip },
    headers: {},
  } as unknown as Request;

  const res = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  return { req, res };
}

function runMiddleware(req: Request, res: Response, next: () => void) {
  rateLimitMiddleware(req, res, next);
}

describe('rateLimitMiddleware', () => {
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
  });

  describe('allows requests under the limit', () => {
    it('should call next() for requests under global limit', () => {
      const ip = `127.0.0.${Math.floor(Math.random() * 255)}`;
      const { req, res } = createMockReqRes('/api/v1/some-path', ip);

      runMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(429);
    });

    it('should allow multiple requests under limit', () => {
      const ip = `10.0.0.${Math.floor(Math.random() * 255)}`;
      const limit = Math.min(5, MAX_REQUESTS - 1);

      for (let i = 0; i < limit; i++) {
        const { req, res } = createMockReqRes('/api/v1/other', ip);
        next = jest.fn();
        runMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
      }
    });
  });

  describe('returns 429 when limit exceeded', () => {
    it('should return 429 when global limit exceeded', () => {
      const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;

      for (let i = 0; i < MAX_REQUESTS; i++) {
        const { req, res } = createMockReqRes('/api/v1/non-auth', ip);
        next = jest.fn();
        runMiddleware(req, res, next);
      }

      const { req, res } = createMockReqRes('/api/v1/non-auth', ip);
      next = jest.fn();
      runMiddleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
          }),
        }),
      );
    });
  });

  describe('auth paths have stricter limits', () => {
    it('should return 429 on auth path after AUTH_MAX_REQUESTS', () => {
      const ip = `172.16.0.${Math.floor(Math.random() * 255)}`;

      for (let i = 0; i < AUTH_MAX_REQUESTS; i++) {
        const { req, res } = createMockReqRes('/api/v1/auth/signin', ip);
        next = jest.fn();
        runMiddleware(req, res, next);
      }

      const { req, res } = createMockReqRes('/api/v1/auth/signin', ip);
      next = jest.fn();
      runMiddleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(429);
    });

    it('should apply stricter limit to /api/v1/bankid/', () => {
      const ip = `10.10.10.${Math.floor(Math.random() * 255)}`;

      for (let i = 0; i < AUTH_MAX_REQUESTS; i++) {
        const { req, res } = createMockReqRes('/api/v1/bankid/auth', ip);
        next = jest.fn();
        runMiddleware(req, res, next);
      }

      const { req, res } = createMockReqRes('/api/v1/bankid/auth', ip);
      next = jest.fn();
      runMiddleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(429);
    });
  });
});
