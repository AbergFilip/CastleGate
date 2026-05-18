import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../database/database.service';

/**
 * Rensar användarens raderade test-/appdata via SQL.
 * Tabeller som saknas ignoreras (42P01). Körs i en transaktion.
 * Rör inte: public.users, refresh_tokens, user_roles.
 */
@Injectable()
export class TestDataService {
  private readonly logger = new Logger(TestDataService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async clearAllForUser(userId: string): Promise<{
    ok: boolean;
    totalRows: number;
    byTable: Record<string, number>;
  }> {
    if (!this.databaseService.isConnected()) {
      throw new ServiceUnavailableException('Databasen är inte tillgänglig');
    }

    const byTable: Record<string, number> = {};

    const safeDelete = async (
      client: PoolClient,
      label: string,
      text: string,
      params: string[] = [userId],
    ): Promise<void> => {
      try {
        const result = await client.query(text, params);
        const n = result.rowCount ?? 0;
        byTable[label] = n;
      } catch (err: any) {
        if (err?.code === '42P01') {
          this.logger.debug(`Skip delete ${label}: table missing`);
          byTable[label] = 0;
          return;
        }
        throw err;
      }
    };

    await this.databaseService.transaction(async (client) => {
      await safeDelete(
        client,
        'transactions',
        'DELETE FROM public.transactions WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'friend_list_members_by_list',
        'DELETE FROM public.friend_list_members WHERE list_id IN (SELECT id FROM public.friend_lists WHERE user_id = $1)',
      );
      await safeDelete(
        client,
        'friend_list_members_by_connection',
        `DELETE FROM public.friend_list_members WHERE connection_id IN (
          SELECT id FROM public.user_connections WHERE user_id = $1 OR connected_user_id = $1
        )`,
      );
      await safeDelete(
        client,
        'friend_lists',
        'DELETE FROM public.friend_lists WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'requests',
        'DELETE FROM public.requests WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'messages',
        'DELETE FROM public.messages WHERE recipient_id = $1 OR sender_id = $1',
      );
      await safeDelete(
        client,
        'network_connections',
        'DELETE FROM public.network_connections WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'user_connections',
        'DELETE FROM public.user_connections WHERE user_id = $1 OR connected_user_id = $1',
      );
      await safeDelete(
        client,
        'user_blocks',
        'DELETE FROM public.user_blocks WHERE user_id = $1 OR blocked_user_id = $1',
      );
      await safeDelete(
        client,
        'notifications',
        'DELETE FROM public.notifications WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'offers',
        'DELETE FROM public.offers WHERE user_id = $1',
      );
      await safeDelete(client, 'loans', 'DELETE FROM public.loans WHERE user_id = $1');
      await safeDelete(client, 'cards', 'DELETE FROM public.cards WHERE user_id = $1');
      await safeDelete(
        client,
        'investments',
        'DELETE FROM public.investments WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'bank_accounts',
        'DELETE FROM public.bank_accounts WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'insurances',
        'DELETE FROM public.insurances WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'vehicles',
        'DELETE FROM public.vehicles WHERE user_id = $1',
      );
      await safeDelete(client, 'boats', 'DELETE FROM public.boats WHERE user_id = $1');
      await safeDelete(
        client,
        'inventories',
        'DELETE FROM public.inventories WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'properties',
        'DELETE FROM public.properties WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'school_contacts',
        `DELETE FROM public.school_contacts WHERE school_id IN (
          SELECT id FROM public.schools WHERE user_id = $1
        )`,
      );
      await safeDelete(
        client,
        'schools',
        'DELETE FROM public.schools WHERE user_id = $1',
      );
      await safeDelete(client, 'grades', 'DELETE FROM public.grades WHERE user_id = $1');
      await safeDelete(
        client,
        'ice_contacts',
        'DELETE FROM public.ice_contacts WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'documents',
        'DELETE FROM public.documents WHERE user_id = $1',
      );
      await safeDelete(
        client,
        'audit_logs',
        'DELETE FROM public.audit_logs WHERE user_id = $1',
      );
    });

    const totalRows = Object.values(byTable).reduce((a, b) => a + b, 0);
    this.logger.warn(
      `Test data cleared for user ${userId}: ${totalRows} rows across ${Object.keys(byTable).length} delete steps`,
    );

    return { ok: true, totalRows, byTable };
  }
}
