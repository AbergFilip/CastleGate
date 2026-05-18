# NestJS Migration Guide

Detta dokument beskriver migreringen från Express.js till NestJS.

## Status

✅ **Färdigt:**
- NestJS projektstruktur och konfiguration
- Supabase service och module
- BankID service, controller och QR-generator
- Authentication guard (JWT)
- Auth service (signup, signin, link, unlink)

🔄 **Pågående:**
- Migration av övriga endpoints (Documents, Users, Network, etc.)

## Projektstruktur

```
backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── decorators/
│   │       └── current-user.decorator.ts
│   ├── bankid/                 # BankID module
│   │   ├── bankid.module.ts
│   │   ├── bankid.service.ts
│   │   ├── bankid.controller.ts
│   │   ├── qr-generator.service.ts
│   │   └── dto/
│   │       └── index.ts
│   ├── supabase/               # Supabase module
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   └── common/                  # Common utilities
│       └── decorators/
│           └── public.decorator.ts
├── server.js                   # Legacy Express server (behålls för nu)
└── package.json
```

## Installation

```bash
cd backend
npm install
```

## Körning

### Development (NestJS)
```bash
npm run start:dev
```

### Production (NestJS)
```bash
npm run build
npm run start:prod
```

### Legacy Express (för jämförelse)
```bash
npm run legacy:dev
```

## API Endpoints

### BankID Endpoints (migrerade)

Alla BankID-endpoints är nu tillgängliga via NestJS:

- `GET /api/bankid/ip` - Hämta användarens IP
- `POST /api/bankid/auth` - Initiera BankID-autentisering
- `POST /api/bankid/collect` - Kontrollera status
- `POST /api/bankid/signup` - Registrera med BankID
- `POST /api/bankid/signin` - Logga in med BankID
- `POST /api/bankid/link` - Koppla BankID till konto (kräver auth)
- `POST /api/bankid/unlink` - Ta bort BankID-koppling (kräver auth)
- `GET /api/bankid/status` - Status
- `POST /api/bankid/qr` - Generera QR-kod
- `POST /api/bankid/cancel` - Avbryt autentisering

### Swagger Documentation

När servern körs, besök:
```
http://localhost:3001/api/docs
```

## Authentication

### Public Routes

Använd `@Public()` decorator för att göra en route publik:

```typescript
@Get('public-endpoint')
@Public()
getPublicData() {
  return { message: 'This is public' };
}
```

### Protected Routes

Alla routes är skyddade som standard. Använd `@CurrentUser()` eller `@CurrentUserId()` för att få användarinformation:

```typescript
@Get('protected')
@ApiBearerAuth()
getProtectedData(@CurrentUser() user: any) {
  return { userId: user.id, email: user.email };
}
```

## Nästa Steg

1. Migrera Documents module
2. Migrera Users module
3. Migrera Network/Connections module
4. Migrera Economy module (bank-accounts, cards, investments, transactions)
5. Migrera Assets module (properties, vehicles, boats, insurances)
6. Migrera Communication module (messages, notifications, requests, offers)
7. Migrera Search och övriga endpoints

## Miljövariabler

Samma `.env`-fil används som tidigare:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BANKID_PRODUCTION=false
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Jämförelse: Express vs NestJS

### Express (Legacy)
```javascript
app.get('/api/documents', verifyUser, async (req, res) => {
  const userId = req.userId;
  // ...
});
```

### NestJS (Ny)
```typescript
@Get('documents')
@ApiBearerAuth()
async getDocuments(@CurrentUserId() userId: string) {
  // ...
}
```

## Tips

- Använd `@ApiTags()` för att gruppera endpoints i Swagger
- Använd `@ApiOperation()` och `@ApiResponse()` för dokumentation
- Använd DTOs med `class-validator` för validering
- Använd `@Global()` för services som behövs överallt (t.ex. SupabaseService)

