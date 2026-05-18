import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuditLogService } from './audit.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly ignoredPaths = new Set([
    '/api/v1/health',
    '/api/v1/status',
    '/api/v1/bankid/status',
    '/api/v1/bankid/ip',
    '/api/v1/migrations/status',
  ]);

  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const path = request?.originalUrl || request?.url || '';

    if (request?.method === 'OPTIONS' || this.ignoredPaths.has(path)) {
      return next.handle();
    }

    const startedAt = Date.now();
    return next.handle().pipe(
      tap(async () => {
        const durationMs = Date.now() - startedAt;
        await this.auditLogService.log({
          userId: request.userId || request.user?.id,
          action: `${request.method} ${path}`,
          resource: request.route?.path || path,
          method: request.method,
          statusCode: response.statusCode,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          traceId: request.traceId,
          metadata: { durationMs },
        });
      }),
      catchError((error) => {
        const durationMs = Date.now() - startedAt;
        void this.auditLogService.log({
          userId: request.userId || request.user?.id,
          action: `${request.method} ${path}`,
          resource: request.route?.path || path,
          method: request.method,
          statusCode: error?.status || response.statusCode,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          traceId: request.traceId,
          metadata: {
            durationMs,
            error: error?.message || 'Unknown error',
          },
        });
        return throwError(() => error);
      })
    );
  }
}
