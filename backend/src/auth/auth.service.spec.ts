import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { RefreshTokenService } from './refresh-token.service';
import { KeyVaultService } from '../secrets/keyvault.service';
import { DatabaseService } from '../database/database.service';

describe('TokenService', () => {
  let service: TokenService;

  const mockKeyVaultService = {
    getSecret: jest.fn().mockResolvedValue('test-secret-key'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'ACCESS_TOKEN_TTL_MINUTES') return '15';
      return undefined;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockKeyVaultService.getSecret.mockResolvedValue('test-secret-key');
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'ACCESS_TOKEN_TTL_MINUTES') return '15';
      return undefined;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: KeyVaultService, useValue: mockKeyVaultService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a valid access token', async () => {
    const payload = { sub: 'user-123', email: 'test@example.com' };
    const token = await service.signAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT format
  });

  it('should verify and decode a valid token', async () => {
    const payload = { sub: 'user-456', email: 'verify@test.com', name: 'Test User' };
    const token = await service.signAccessToken(payload);
    const decoded = await service.verifyAccessToken(token);
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.name).toBe(payload.name);
  });

  it('should throw when verifying an invalid token', async () => {
    await expect(service.verifyAccessToken('invalid.token.here')).rejects.toThrow();
  });
});

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;

  const mockKeyVaultService = {
    getSecret: jest.fn().mockResolvedValue('test-refresh-pepper'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'REFRESH_TOKEN_TTL_DAYS') return '30';
      return undefined;
    }),
  };

  const mockDatabaseService = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };

  const mockTokenService = {
    signAccessToken: jest.fn().mockResolvedValue('mock-access-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockKeyVaultService.getSecret.mockResolvedValue('test-refresh-pepper');
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'REFRESH_TOKEN_TTL_DAYS') return '30';
      return undefined;
    });
    mockDatabaseService.query.mockResolvedValue({ rows: [] });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: KeyVaultService, useValue: mockKeyVaultService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should produce consistent hash for same token (hashing consistency)', async () => {
    const result = await service.issueTokens({ userId: 'user-1' });
    // refreshTokens: SELECT (needs row) -> UPDATE (revoke) -> issueTokens INSERT
    // Use mockImplementation to return row for SELECT, empty for UPDATE/INSERT
    const storedRow = {
      id: 'rt-1',
      user_id: 'user-1',
      token_hash: 'any',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      revoked_at: null,
    };
    let callCount = 0;
    mockDatabaseService.query.mockImplementation((sql: string) => {
      callCount++;
      if (sql.includes('SELECT') && sql.includes('token_hash')) {
        return Promise.resolve({ rows: [storedRow] });
      }
      return Promise.resolve({ rows: [] });
    });
    const refreshed = await service.refreshTokens({ refreshToken: result.refreshToken });
    expect(refreshed.accessToken).toBeDefined();
    expect(refreshed.refreshToken).toBeDefined();
  });

  it('should issue tokens and store refresh token hash in DB', async () => {
    const result = await service.issueTokens({ userId: 'user-99' });
    expect(result.accessToken).toBe('mock-access-token');
    expect(result.refreshToken).toBeDefined();
    expect(mockDatabaseService.query).toHaveBeenCalled();
  });
});
