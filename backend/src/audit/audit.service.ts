import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface AuditLogEntry {
  userId?: string | null;
  action: string;
  resource?: string | null;
  method?: string | null;
  statusCode?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  traceId?: string | null;
  metadata?: Record<string, any> | null;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async log(entry: AuditLogEntry) {
    try {
      await this.databaseService.query(
        `INSERT INTO public.audit_logs
          (user_id, action, resource, method, status_code, ip_address, user_agent, trace_id, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          entry.userId || null,
          entry.action,
          entry.resource || null,
          entry.method || null,
          entry.statusCode || null,
          entry.ipAddress || null,
          entry.userAgent || null,
          entry.traceId || null,
          entry.metadata || null,
        ]
      );
    } catch (error: any) {
      this.logger.warn(`Audit log failed: ${error.message}`);
    }
  }
}
