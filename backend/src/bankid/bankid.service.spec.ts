import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BankidService } from './bankid.service';
import { QrGeneratorService } from './qr-generator.service';

jest.mock('bankid', () => ({
  BankIdClientV6: jest.fn().mockImplementation(() => ({
    authenticate: jest.fn().mockResolvedValue({
      orderRef: 'order-ref-123',
      autoStartToken: 'auto-token',
      qrStartToken: 'qr-token',
      qrStartSecret: 'qr-secret',
      qr: null,
    }),
    collect: jest.fn(),
    cancel: jest.fn(),
  })),
}));

describe('BankidService', () => {
  let service: BankidService;

  const mockConfigService = {
    get: jest.fn((key: string) => (key === 'BANKID_PRODUCTION' ? 'false' : undefined)),
  };

  const mockQrGeneratorService = {
    generateBankIDQR: jest.fn((token: string, secret: string, seconds: number) =>
      `bankid.${token}.${seconds}.mock`,
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) =>
      key === 'BANKID_PRODUCTION' ? 'false' : undefined,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankidService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: QrGeneratorService, useValue: mockQrGeneratorService },
      ],
    }).compile();

    service = module.get<BankidService>(BankidService);
    service.onModuleInit();
  });

  describe('getUserIp', () => {
    it('should return 127.0.0.1 for ::1', () => {
      const req = { ip: '::1' };
      expect(service.getUserIp(req)).toBe('127.0.0.1');
    });

    it('should return 127.0.0.1 for ::ffff:127.0.0.1', () => {
      const req = { ip: '::ffff:127.0.0.1' };
      expect(service.getUserIp(req)).toBe('127.0.0.1');
    });

    it('should strip ::ffff: prefix from IPv4-mapped IPv6', () => {
      const req = { ip: '::ffff:192.168.1.1' };
      expect(service.getUserIp(req)).toBe('192.168.1.1');
    });

    it('should return normal IPv4 as-is', () => {
      const req = { ip: '192.168.1.100' };
      expect(service.getUserIp(req)).toBe('192.168.1.100');
    });

    it('should use x-forwarded-for when ip is absent', () => {
      const req = { headers: { 'x-forwarded-for': '10.0.0.5, 10.0.0.1' } };
      expect(service.getUserIp(req)).toBe('10.0.0.5');
    });

    it('should fallback to 127.0.0.1 when no IP available', () => {
      const req = { headers: {}, connection: undefined, socket: undefined };
      expect(service.getUserIp(req)).toBe('127.0.0.1');
    });
  });

  describe('generateQR', () => {
    it('should return null for unknown orderRef', () => {
      const result = service.generateQR('unknown-order-ref');
      expect(result).toBeNull();
    });

    it('should return QR string when orderRef exists in cache', async () => {
      await service.authenticate(undefined, '127.0.0.1');
      const { BankIdClientV6 } = require('bankid');
      const mockInstance = (BankIdClientV6 as jest.Mock).mock.results[0]?.value;
      const orderRef = mockInstance?.authenticate?.mock?.results?.[0]?.value?.orderRef ?? 'order-ref-123';
      const result = service.generateQR(orderRef);
      expect(result).not.toBeNull();
      expect(result).toMatch(/^bankid\./);
    });
  });

  describe('QR cache cleanup', () => {
    it('should remove cache entry after 60 seconds', async () => {
      jest.useFakeTimers();
      await service.authenticate(undefined, '127.0.0.1');
      const authResult = await service.authenticate(undefined, '127.0.0.1');
      const orderRef = authResult.orderRef;

      expect(service.generateQR(orderRef)).not.toBeNull();

      jest.advanceTimersByTime(59000);
      expect(service.generateQR(orderRef)).not.toBeNull();

      jest.advanceTimersByTime(2000);
      expect(service.generateQR(orderRef)).toBeNull();

      jest.useRealTimers();
    });
  });
});
