import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeyVaultService } from './keyvault.service';

/**
 * Key Vault Module
 * 
 * Global modul som tillhandahåller KeyVaultService för alla moduler.
 * Används för säker hantering av secrets via Azure Key Vault.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [KeyVaultService],
  exports: [KeyVaultService],
})
export class KeyVaultModule {}
