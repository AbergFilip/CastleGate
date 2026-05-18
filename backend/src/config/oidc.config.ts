import { registerAs } from '@nestjs/config';

export default registerAs('oidc', () => ({
  enabled: process.env.OIDC_ENABLED === 'true',
  provider: process.env.OIDC_PROVIDER || 'azure-ad-b2c',
  azureAdB2C: {
    tenantId: process.env.AZURE_AD_B2C_TENANT_ID,
    clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
    policy: process.env.AZURE_AD_B2C_POLICY || 'B2C_1_signupsignin',
    authority: process.env.AZURE_AD_B2C_AUTHORITY,
    issuer: process.env.AZURE_AD_B2C_ISSUER,
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE,
    jwksUri: process.env.AUTH0_JWKS_URI,
  },
  keycloak: {
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    serverUrl: process.env.KEYCLOAK_SERVER_URL,
  },
  jwksUri: process.env.OIDC_JWKS_URI,
  issuer: process.env.OIDC_ISSUER,
}));

