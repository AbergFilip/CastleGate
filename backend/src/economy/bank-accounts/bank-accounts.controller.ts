import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { readFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { writeToLogFile } from '../../common/file-logger';
import { BankAccountsService } from './bank-accounts.service';

// Ladda backend/.env direkt vid start (require.main.path = dist/ när main.js körs)
try {
  const path = require('path');
  const dotenv = require('dotenv');
  const mainDir = require.main?.filename ? dirname(require.main.filename) : process.cwd();
  dotenv.config({ path: path.join(mainDir, '..', '.env') });
} catch {
  //
}
import { TinkService } from '../tink/tink.service';
import { GoCardlessService } from '../gocardless/gocardless.service';
import { SandboxBankService } from '../sandbox-bank/sandbox-bank.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { TinkCallbackDto } from './dto/tink-callback.dto';
import { SandboxConnectDto } from './dto/sandbox-connect.dto';
import { SandboxCallbackDto } from './dto/sandbox-callback.dto';
import { GoCardlessConnectDto } from './dto/gocardless-connect.dto';
import { GoCardlessCallbackDto } from './dto/gocardless-callback.dto';

/** Läs TINK_CLIENT_ID och TINK_CLIENT_SECRET (process.env först, sedan .env-fil). */
function loadTinkCredentialsFromFile(): { clientId: string; clientSecret: string } | null {
  const fromEnv = process.env.TINK_CLIENT_ID && process.env.TINK_CLIENT_SECRET;
  if (fromEnv) {
    return {
      clientId: process.env.TINK_CLIENT_ID!,
      clientSecret: process.env.TINK_CLIENT_SECRET!,
    };
  }
  const mainDir =
    typeof require !== 'undefined' && require.main?.filename
      ? dirname(require.main.filename)
      : __dirname;
  const possiblePaths = [
    resolve(mainDir, '..', '.env'),
    resolve(mainDir, '..', 'tink.env'),
    resolve(__dirname, '..', '..', '..', '.env'),
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), 'tink.env'),
    resolve(process.cwd(), 'backend', '.env'),
  ];
  for (const envPath of possiblePaths) {
    if (!existsSync(envPath)) continue;
    try {
      const content = readFileSync(envPath, 'utf-8');
      let clientId = '';
      let clientSecret = '';
      for (const line of content.split(/\r?\n/)) {
        const t = line.trim();
        if (t && !t.startsWith('#')) {
          const eq = t.indexOf('=');
          if (eq > 0) {
            const key = t.slice(0, eq).trim().replace(/^\uFEFF/, '');
            const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
            if (key === 'TINK_CLIENT_ID') clientId = val;
            if (key === 'TINK_CLIENT_SECRET') clientSecret = val;
          }
        }
      }
      if (clientId && clientSecret) return { clientId, clientSecret };
    } catch {
      //
    }
  }
  return null;
}

@ApiTags('Bank Accounts')
@Controller('bank-accounts')
@ApiBearerAuth()
export class BankAccountsController {
  private readonly logger = new Logger(BankAccountsController.name);

  constructor(
    private readonly bankAccountsService: BankAccountsService,
    private readonly tinkService: TinkService,
    private readonly goCardlessService: GoCardlessService,
    private readonly sandboxBankService: SandboxBankService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all bank accounts for current user' })
  @ApiResponse({ status: 200, description: 'Bank accounts retrieved successfully' })
  async getBankAccounts(@CurrentUserId() userId: string) {
    return await this.bankAccountsService.getBankAccounts(userId);
  }

  @Post('tink-callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync bank accounts from Tink Account Check callback' })
  @ApiResponse({ status: 200, description: 'Accounts synced from Tink' })
  async tinkCallback(
    @CurrentUserId() userId: string,
    @Body() body: TinkCallbackDto,
  ) {
    const reportId = body.account_verification_report_id ?? body.accountVerificationReportId;
    if (!reportId) {
      writeToLogFile('[tink-callback] Fel: account_verification_report_id krävs');
      return { ok: false, message: 'account_verification_report_id krävs', created: 0 };
    }
    const creds = loadTinkCredentialsFromFile();
    if (!creds) {
      writeToLogFile('[tink-callback] Fel: TINK_CLIENT_ID/TINK_CLIENT_SECRET saknas i .env');
      return { ok: false, message: 'TINK_CLIENT_ID och TINK_CLIENT_SECRET saknas i backend/.env', created: 0 };
    }
    try {
      this.logger.log(`Tink callback: userId=${userId}, reportId=${reportId}`);
      writeToLogFile(`[tink-callback] userId=${userId} reportId=${reportId}`);
      const accounts = await this.tinkService.getAccountsFromReportWithCredentials(
        reportId,
        creds.clientId,
        creds.clientSecret,
      );
      let created = 0;
      const errors: string[] = [];
      for (const acc of accounts) {
        const bankName = (acc.financialInstitutionName?.trim() || 'Bank').trim() || 'Bank';
        const accountName = (acc.name?.trim() || 'Konto').trim() || 'Konto';
        try {
          await this.bankAccountsService.createBankAccount(userId, {
            bank_name: bankName,
            account_name: accountName,
            account_number: acc.accountNumber?.trim() || undefined,
            balance: acc.balance ?? 0,
            currency: acc.currencyCode?.trim() || 'SEK',
            notes: `Tink: ${acc.id}`,
          });
          created++;
        } catch (e: any) {
          const msg = e?.message ?? String(e);
          errors.push(`${accountName}: ${msg}`);
          this.logger.warn(`Tink konto kunde inte sparas: ${accountName} – ${msg}`);
        }
      }
      this.logger.log(`Tink callback result: ${created} skapade av ${accounts.length} från Tink${errors.length > 0 ? `; fel: ${errors.join('; ')}` : ''}`);
      if (errors.length > 0 && created === 0) {
        const msg = errors[0] ?? 'Kunde inte spara konton';
        writeToLogFile(`[tink-callback] Fel: ${msg} (total ${accounts.length} från Tink)`);
        return { ok: false, message: msg, created: 0, total: accounts.length };
      }
      if (created === 0 && accounts.length === 0) {
        const debug = await this.tinkService.getReportKeysAndPreview(creds.clientId, creds.clientSecret, reportId);
        writeToLogFile(`[tink-callback] 0 konton i rapporten. Nycklar: ${(debug?.keys ?? []).join(', ')}`);
        return { ok: true, created: 0, total: 0, debugReportKeys: debug.keys, debugPreview: debug.preview };
      }
      writeToLogFile(`[tink-callback] OK: ${created} konton skapade av ${accounts.length}`);
      return { ok: true, created, total: accounts.length };
    } catch (err: any) {
      const message = err?.message ?? 'Kunde inte hämta konton från Tink';
      writeToLogFile(`[tink-callback] Exception: ${message}`);
      return { ok: false, message, created: 0 };
    }
  }

  @Post('demo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create demo/fake bank accounts for testing (no Tink)' })
  @ApiResponse({ status: 200, description: 'Demo accounts created' })
  async createDemoAccounts(@CurrentUserId() userId: string) {
    const demos: Array<{ bank_name: string; account_name: string; account_number?: string; balance: number; currency: string; notes?: string }> = [
      { bank_name: 'Demo Bank', account_name: 'Lönekonto', account_number: 'SE** 1234', balance: 45_000, currency: 'SEK', notes: 'Demo' },
      { bank_name: 'Demo Bank', account_name: 'Sparkonto', account_number: 'SE** 5678', balance: 125_000, currency: 'SEK', notes: 'Demo' },
      { bank_name: 'Demo Bank', account_name: 'Buffertkonto', account_number: 'SE** 9012', balance: 25_000, currency: 'SEK', notes: 'Demo' },
    ];
    let created = 0;
    const errors: string[] = [];
    for (const d of demos) {
      try {
        await this.bankAccountsService.createBankAccount(userId, d);
        created++;
      } catch (e: any) {
        errors.push(e?.message ?? String(e));
      }
    }
    this.logger.log(`Demo accounts: ${created} skapade av ${demos.length} för userId=${userId}`);
    return { ok: true, created, total: demos.length, message: created > 0 ? `${created} demo-konton skapade.` : (errors[0] ?? 'Kunde inte skapa demo-konton.') };
  }

  @Get('sandbox/banks')
  @ApiOperation({ summary: 'List available sandbox banks (Swedish)' })
  @ApiResponse({ status: 200, description: 'Sandbox banks listed' })
  async getSandboxBanks() {
    return { ok: true, banks: this.sandboxBankService.getBanks() };
  }

  @Post('sandbox/connect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a sandbox bank session (simulated connection)' })
  @ApiResponse({ status: 200, description: 'Sandbox session created' })
  async sandboxConnect(@Body() body: SandboxConnectDto) {
    if (!body.bank_id) {
      return { ok: false, message: 'bank_id krävs' };
    }
    try {
      const session = this.sandboxBankService.createSession(body.bank_id);
      return { ok: true, session_id: session.id, bank_name: session.bankName, account_count: session.accounts.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte skapa sandbox-session' };
    }
  }

  @Post('sandbox/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync accounts from a sandbox bank session' })
  @ApiResponse({ status: 200, description: 'Sandbox accounts synced' })
  async sandboxCallback(
    @CurrentUserId() userId: string,
    @Body() body: SandboxCallbackDto,
  ) {
    if (!body.session_id) {
      return { ok: false, message: 'session_id krävs', created: 0 };
    }
    const session = this.sandboxBankService.getSession(body.session_id);
    if (!session) {
      return { ok: false, message: 'Sandbox-session hittades inte eller har gått ut', created: 0 };
    }
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];
    for (const acc of session.accounts) {
      try {
        const result = await this.bankAccountsService.createBankAccount(userId, {
          bank_name: session.bankName,
          account_name: acc.name,
          account_number: acc.accountNumber,
          account_type: acc.type,
          balance: acc.balance,
          currency: acc.currency,
          iban: acc.iban,
          notes: `Sandbox: ${acc.id}`,
        });
        if ((result as any).duplicate) {
          skipped++;
        } else {
          created++;
        }
      } catch (e: any) {
        errors.push(`${acc.name}: ${e?.message ?? String(e)}`);
      }
    }
    this.logger.log(`Sandbox callback: ${created} nya, ${skipped} befintliga av ${session.accounts.length} (${session.bankName}) för userId=${userId}`);
    return { ok: true, created, skipped, total: session.accounts.length, bank_name: session.bankName };
  }

  @Get('gocardless/institutions')
  @ApiOperation({ summary: 'List available banks via GoCardless' })
  @ApiResponse({ status: 200, description: 'Institutions listed' })
  async getGoCardlessInstitutions() {
    try {
      const institutions = await this.goCardlessService.getInstitutions('SE');
      return { ok: true, institutions };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte hämta banker', institutions: [] };
    }
  }

  @Post('gocardless/connect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a GoCardless bank connection (requisition)' })
  @ApiResponse({ status: 200, description: 'Requisition created with redirect link' })
  async goCardlessConnect(
    @Body() body: GoCardlessConnectDto,
  ) {
    const redirectUri = body.redirect_uri || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/connect-bank/callback`;
    const institutionId = body.institution_id || 'SANDBOXFINANCE_SFIN0000';
    try {
      const req = await this.goCardlessService.createRequisition(institutionId, redirectUri);
      return { ok: true, requisition_id: req.id, link: req.link };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte skapa GoCardless-anslutning' };
    }
  }

  @Post('gocardless/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync bank accounts from GoCardless after user authentication' })
  @ApiResponse({ status: 200, description: 'Accounts synced from GoCardless' })
  async goCardlessCallback(
    @CurrentUserId() userId: string,
    @Body() body: GoCardlessCallbackDto,
  ) {
    if (!body.requisition_id) {
      return { ok: false, message: 'requisition_id krävs', created: 0 };
    }
    try {
      const accounts = await this.goCardlessService.getAccountsFromRequisition(body.requisition_id);
      let created = 0;
      const errors: string[] = [];
      for (const acc of accounts) {
        const bankName = acc.institutionName?.trim() || 'GoCardless Bank';
        const accountName = acc.name?.trim() || 'Konto';
        try {
          await this.bankAccountsService.createBankAccount(userId, {
            bank_name: bankName,
            account_name: accountName,
            account_number: acc.iban ?? undefined,
            balance: acc.balance ?? 0,
            currency: acc.currency?.trim() || 'SEK',
            notes: `GoCardless: ${acc.id}`,
          });
          created++;
        } catch (e: any) {
          errors.push(`${accountName}: ${e?.message ?? String(e)}`);
          this.logger.warn(`GoCardless konto kunde inte sparas: ${accountName} – ${e?.message}`);
        }
      }
      this.logger.log(`GoCardless callback: ${created} skapade av ${accounts.length} för userId=${userId}`);
      if (created === 0 && accounts.length === 0) {
        return { ok: true, created: 0, total: 0, message: 'Inga konton hittades i GoCardless-anslutningen.' };
      }
      return { ok: true, created, total: accounts.length };
    } catch (err: any) {
      return { ok: false, message: err?.message ?? 'Kunde inte hämta konton från GoCardless', created: 0 };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single bank account by ID' })
  @ApiResponse({ status: 200, description: 'Bank account retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async getBankAccountById(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.bankAccountsService.getBankAccountById(userId, id);
  }

  @Post('refresh-balance/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh balance from Tink for a connected bank account' })
  @ApiResponse({ status: 200, description: 'Balance updated' })
  @ApiResponse({ status: 404, description: 'Bank account not found or not a Tink account' })
  async refreshBalance(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    const { account } = await this.bankAccountsService.getBankAccountById(userId, id);
    const notes = (account?.notes ?? '') as string;
    const sandboxId = notes.startsWith('Sandbox: ') ? notes.slice(9).trim() : null;
    if (sandboxId) {
      const balance = this.sandboxBankService.refreshBalance(sandboxId);
      if (!balance) {
        return { ok: false, message: 'Sandbox-konto hittades inte (sessionen kan ha gått ut).' };
      }
      await this.bankAccountsService.updateBankAccount(userId, id, {
        balance: balance.value,
        currency: balance.currency,
      });
      return { ok: true, balance: balance.value, currency: balance.currency };
    }
    const gcId = notes.startsWith('GoCardless: ') ? notes.slice(12).trim() : null;
    if (gcId) {
      try {
        const balance = await this.goCardlessService.refreshAccountBalance(gcId);
        if (!balance) {
          return { ok: false, message: 'Kunde inte hämta saldo från GoCardless.' };
        }
        await this.bankAccountsService.updateBankAccount(userId, id, {
          balance: balance.value,
          currency: balance.currency,
        });
        return { ok: true, balance: balance.value, currency: balance.currency };
      } catch (err: any) {
        return { ok: false, message: err?.message ?? 'Kunde inte uppdatera saldo från GoCardless.' };
      }
    }
    const tinkId = notes.startsWith('Tink: ') ? notes.slice(6).trim() : null;
    if (!tinkId) {
      writeToLogFile('[refresh-balance] Fel: Kontot är inte ett anslutet konto');
      return { ok: false, message: 'Det här kontot är inte kopplat via Tink eller GoCardless.' };
    }
    const creds = loadTinkCredentialsFromFile();
    if (!creds) {
      writeToLogFile('[refresh-balance] Fel: Tink-uppgifter saknas');
      return { ok: false, message: 'Tink-uppgifter saknas i backend.' };
    }
    try {
      const token = await this.tinkService.getAccessTokenWithCredentials(creds.clientId, creds.clientSecret);
      const balance = await this.tinkService.getAccountBalance(token, tinkId);
      if (balance == null) {
        const debug = await this.tinkService.getBalanceResponseDebug(creds.clientId, creds.clientSecret, tinkId);
        this.logger.log(`RefreshBalance: getAccountBalance null för tinkId=${tinkId}. Debug: status=${debug.status} error=${debug.error ?? '—'}`);
        writeToLogFile(`[refresh-balance] tinkId=${tinkId} status=${debug.status} error=${debug.error ?? '—'} source=${debug.source ?? '—'}`);
        const baseMsg =
          debug.status === 403
            ? 'Tink svarar 403 på saldo-API. Med Account Check använder vi endast client-token; Data v2 kräver användartoken för kontoinfo/saldo, så automatisk saldohämtning går inte utan att Tink aktiverar accounts.balances:readonly för ert client (kontakta Tink Support). Tills dess: ange saldo manuellt under Redigera konto.'
            : debug.status === 401
              ? 'Tink token avvisad (401). Kontrollera TINK_CLIENT_ID och TINK_CLIENT_SECRET.'
              : debug.error
                ? `Tink: ${debug.error}`
                : `Saldo-API svarade ${debug.status}. Se backend-loggen ("Tink balance svar") för detaljer.`;
        return {
          ok: false,
          message: baseMsg,
          debug: { status: debug.status, error: debug.error, source: debug.source },
        };
      }
      await this.bankAccountsService.updateBankAccount(userId, id, {
        balance: balance.value,
        currency: balance.currency,
      });
      writeToLogFile(`[refresh-balance] OK: konto ${id} saldo=${balance.value} ${balance.currency}`);
      return { ok: true, balance: balance.value, currency: balance.currency };
    } catch (err: any) {
      const msg = err?.message ?? 'Kunde inte uppdatera saldo.';
      writeToLogFile(`[refresh-balance] Exception konto ${id}: ${msg}`);
      this.logger.warn(`Refresh balance failed for ${id}: ${msg}`);
      return { ok: false, message: msg };
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({ status: 201, description: 'Bank account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createBankAccount(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateBankAccountDto
  ) {
    return await this.bankAccountsService.createBankAccount(userId, createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a bank account' })
  @ApiResponse({ status: 200, description: 'Bank account updated successfully' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async updateBankAccount(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateBankAccountDto
  ) {
    return await this.bankAccountsService.updateBankAccount(userId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a bank account' })
  @ApiResponse({ status: 200, description: 'Bank account deleted successfully' })
  async deleteBankAccount(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.bankAccountsService.deleteBankAccount(userId, id);
  }
}

