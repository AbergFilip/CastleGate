import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Ensures every request has a correlation/trace ID for logging and responses
export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headerName = 'x-correlation-id';
  const incoming = req.headers[headerName] as string | undefined;
  const traceId = incoming && incoming.length > 0 ? incoming : randomUUID();

  // Attach to request and response for downstream logging
  (req as any).traceId = traceId;
  req.headers[headerName] = traceId;
  res.setHeader(headerName, traceId);

  next();
}


