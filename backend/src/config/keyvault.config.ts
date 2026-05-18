import { registerAs } from '@nestjs/config';

export default registerAs('keyvault', () => ({
  enabled: process.env.KEY_VAULT_ENABLED === 'true',
  vaultUrl: process.env.AZURE_KEY_VAULT_URL,
  // För lokal utveckling med service principal:
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  tenantId: process.env.AZURE_TENANT_ID,
}));
