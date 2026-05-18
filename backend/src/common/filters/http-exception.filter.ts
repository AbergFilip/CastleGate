import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const resPayload =
      exception instanceof HttpException ? exception.getResponse() : null;

    const traceId = (request as any).traceId || request.headers['x-correlation-id'];

    const message =
      typeof resPayload === 'string'
        ? resPayload
        : (resPayload as any)?.message || 'Internal server error';

    const details =
      resPayload && typeof resPayload === 'object' && (resPayload as any).message
        ? (resPayload as any).message
        : undefined;

    const code =
      (resPayload as any)?.code ||
      (HttpStatus[status] as string) ||
      'ERROR';

    const body = {
      error: {
        code,
        message,
        traceId,
        details: Array.isArray(details) ? details : undefined,
      },
      meta: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - traceId=${traceId} - ${JSON.stringify(body)}`
    );

    response.status(status).json(body);
  }
}

