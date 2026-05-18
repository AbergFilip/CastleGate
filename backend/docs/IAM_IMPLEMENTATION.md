# IAM & Security Implementation Guide

## Översikt
Detta dokument beskriver implementationen av Identity and Access Management (IAM) och säkerhetsstrukturen i CastleGate backend. Systemet är designat för att stödja både B2C (privatpersoner) och B2B (företagsanvändare) med en robust behörighetsmodell.

## Arkitektur

### Authentication Flow
Systemet stödjer två primära autentiseringsmetoder:
1. **BankID (via Supabase/Custom):** Primär metod för svenska användare.
2. **OIDC (OpenID Connect):** Förberett för integration med Azure AD B2C eller extern IdP.

### Authorization (RBAC)
Vi använder en rollbaserad åtkomstkontroll (RBAC) där behörigheter styrs av vilken roll en användare har.

#### Roller
- **B2C_USER:** Standardroll för privatpersoner. Har tillgång till sin egen data (ekonomi, tillgångar, dokument).
- **B2B_USER:** Standardroll för företagsanvändare. Kan representera en organisation.
- **B2B_ADMIN:** Administratör för en organisation. Kan hantera andra användare inom samma organisation.
- **SYSTEM_ADMIN:** Super-admin med fullständig åtkomst.

## Implementation Detaljer

### 1. User Type Separation
Vi skiljer på användare genom `UserType` enum och metadata.
- **Fil:** `src/users/dto/user-type.dto.ts`
- **Decorator:** `@RequireUserType(UserType.B2B)`
- **Guard:** `UserTypeGuard`

Används för att låsa endpoints till specifika användartyper:
```typescript
@UseGuards(UserTypeGuard)
@RequireUserType(UserType.B2B)
@Get('company-data')
getData() { ... }
```

### 2. RBAC System
Ett flexibelt system för att hantera roller och rättigheter.
- **Modul:** `src/rbac/rbac.module.ts`
- **Tabeller:** `roles`, `permissions`, `user_roles`, `role_permissions`
- **Guard:** `RbacGuard`

Exempel på användning:
```typescript
@UseGuards(RbacGuard)
@Roles('B2B_ADMIN')
@Permissions('manage_users')
@Post('users')
createUser() { ... }
```

### 3. OIDC Integration
Systemet är förberett för att agera som en Resource Server mot en OIDC Provider.
- **Modul:** `src/auth/oidc/oidc.module.ts`
- **Guard:** `OidcAuthGuard`
- **Konfiguration:** Styrs via miljövariabler (`OIDC_ISSUER`, `OIDC_CLIENT_ID`).

### 4. API Security & Management
Förberedelser för Azure API Management och generell API-säkerhet.
- **Versioning:** Alla endpoints prefixas automatiskt (t.ex. `/api/v1/`).
- **Logging:** Middleware loggar alla anrop för spårbarhet.
- **Filters:** Global felhantering säkerställer att inga känsliga stacktraces läcker ut.

## Konfiguration

### Miljövariabler (.env)
Följande variabler krävs för IAM-funktionalitet:

```bash
# Auth
JWT_SECRET=your-secret
SUPABASE_URL=your-url
SUPABASE_KEY=your-key

# OIDC (Valfritt om inaktiverat)
OIDC_ENABLED=true
OIDC_ISSUER=https://your-tenant.b2clogin.com/...
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret

# BankID
BANKID_ENV=test
```

## Databas Schema
Säkerhetsmodellen bygger på följande tabellstruktur i PostgreSQL (Supabase):

1. **users:** Utökad med `user_type`, `organization_id`.
2. **roles:** Definition av roller.
3. **permissions:** Definition av granulära rättigheter.
4. **user_roles:** Kopplingstabell.
5. **role_permissions:** Kopplingstabell.

## Testing & Verifiering
För att verifiera säkerheten:
1. **User Type:** Försök anropa en B2B-endpoint med en B2C-användare (ska ge 403 Forbidden).
2. **RBAC:** Försök utföra en administrativ åtgärd utan rätt roll (ska ge 403 Forbidden).
3. **Public endpoints:** Verifiera att `@Public()` endpoints är åtkomliga utan token.
