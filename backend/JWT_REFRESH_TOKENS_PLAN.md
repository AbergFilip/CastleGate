# JWT Refresh Tokens - Implementation Plan

## Översikt

Enligt IAM-designen behöver vi implementera:
- **Korta access tokens** (15 minuter TTL)
- **Refresh tokens** (lång livslängd, 7-30 dagar)
- **Token rotation** (ny refresh token vid varje refresh)
- **Token revocation** (möjlighet att ogiltigförklara tokens)

---

## Nuvarande Situation

### ✅ Vad som finns:
- JWT validation (Auth0 OIDC + Supabase fallback)
- Access tokens från Auth0
- Frontend Auth0 SPA SDK (hanterar tokens automatiskt)

### ❌ Vad som saknas:
- Refresh token endpoint i backend
- Refresh token storage i databas
- Token rotation logic
- Token revocation system

---

## Implementation Plan

### **Fas 1: Backend - Refresh Token Storage** 📦

#### 1.1 Skapa refresh_tokens tabell
```sql
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE, -- Hashat refresh token
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  device_info JSONB, -- Browser/device info för säkerhet
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON public.refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON public.refresh_tokens(expires_at);
```

#### 1.2 RefreshToken Entity/Service
- `RefreshTokenService` för att hantera tokens
- Hash tokens med bcrypt/argon2
- Validera tokens
- Rota tokens (generera ny vid refresh)

---

### **Fas 2: Backend - Refresh Endpoint** 🔄

#### 2.1 Refresh Token Controller
```typescript
@Controller('auth')
export class AuthController {
  @Post('refresh')
  @Public() // Ingen auth krävs (använder refresh token)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    // 1. Validera refresh token
    // 2. Kontrollera att token inte är revoked/expired
    // 3. Generera ny access token (kort TTL)
    // 4. Rotera refresh token (ny refresh token)
    // 5. Returnera båda
  }
}
```

#### 2.2 Refresh Token DTO
```typescript
export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
```

---

### **Fas 3: Backend - Token Rotation** 🔐

#### 3.1 Rotation Logic
- När refresh token används:
  1. Validera gammal refresh token
  2. Generera ny access token (15 min TTL)
  3. Generera ny refresh token (30 dagar TTL)
  4. Invalidera gammal refresh token
  5. Spara ny refresh token (hashat)

**Säkerhetsfördelar:**
- Om refresh token stjäls, kan den bara användas en gång
- Automatisk rotation vid varje refresh

---

### **Fas 4: Backend - Token Revocation** 🚫

#### 4.1 Revoke Endpoint
```typescript
@Post('revoke')
@UseGuards(JwtAuthGuard)
async revokeToken(@Req() req, @Body() dto: RevokeTokenDto) {
  // Invalidera specifik refresh token eller alla för användaren
}
```

#### 4.2 Logout Endpoint
```typescript
@Post('logout')
@UseGuards(JwtAuthGuard)
async logout(@Req() req) {
  // Invalidera alla refresh tokens för användaren
}
```

---

### **Fas 5: Frontend - Token Management** 💻

#### 5.1 Uppdatera Auth0Context
- Hantera refresh token storage (localStorage/sessionStorage)
- Automatisk refresh när access token går ut
- Retry logic vid failed refresh

#### 5.2 Token Refresh Interceptor
- Intercept 401 responses
- Försök refresh token
- Retry original request

---

## Tekniska Detaljer

### **Access Token (Kort TTL)**
- **TTL:** 15 minuter
- **Innehåll:** User ID, roles, permissions
- **Validering:** JWT signature + expiration check
- **Storage:** Memory (inte localStorage)

### **Refresh Token (Lång TTL)**
- **TTL:** 30 dagar
- **Innehåll:** Endast token ID (hashat i databas)
- **Validering:** Database lookup + expiration check
- **Storage:** HttpOnly cookie (säkrast) eller localStorage

### **Token Rotation Flow**
```
1. Client har access token (går ut om 15 min)
2. Client har refresh token (går ut om 30 dagar)
3. När access token går ut:
   a. Client skickar refresh token till /auth/refresh
   b. Backend validerar refresh token
   c. Backend genererar ny access token (15 min)
   d. Backend genererar ny refresh token (30 dagar)
   e. Backend invaliderar gammal refresh token
   f. Client sparar nya tokens
```

---

## Säkerhetsöverväganden

### ✅ **Best Practices:**
1. **Hash refresh tokens** (bcrypt/argon2) i databas
2. **HttpOnly cookies** för refresh tokens (XSS-skydd)
3. **SameSite=Strict** cookies (CSRF-skydd)
4. **Token rotation** (ny refresh token vid varje refresh)
5. **Device fingerprinting** (spåra vilken enhet)
6. **IP validation** (valfritt, kan vara problematiskt)

### ⚠️ **Varningar:**
- **Access tokens i localStorage:** Risk för XSS
- **Refresh tokens i localStorage:** Risk för XSS (använd HttpOnly cookies istället)
- **Ingen token rotation:** Om refresh token stjäls, kan den användas obegränsat

---

## Integration med Auth0

### **Nuvarande Setup:**
- Auth0 genererar access tokens (lång TTL, ~24h)
- Frontend Auth0 SPA SDK hanterar tokens automatiskt

### **Nytt Setup:**
- Auth0 access tokens (kort TTL, 15 min) - konfigurera i Auth0
- Vårt eget refresh token system (backend)
- Frontend hanterar båda tokens

### **Alternativ:**
- Använd Auth0's refresh token system (om tillgängligt)
- Eller bygg eget system (mer kontroll)

---

## Implementation Steps

### **Steg 1: Database Schema** (30 min)
- [ ] Skapa `refresh_tokens` tabell
- [ ] Migration script

### **Steg 2: Backend Service** (1-2 timmar)
- [ ] `RefreshTokenService`
- [ ] Token generation (JWT)
- [ ] Token validation
- [ ] Token rotation logic

### **Steg 3: Backend Endpoints** (1 timme)
- [ ] `POST /auth/refresh`
- [ ] `POST /auth/revoke`
- [ ] `POST /auth/logout`

### **Steg 4: Frontend Integration** (1-2 timmar)
- [ ] Uppdatera `Auth0Context`
- [ ] Token refresh interceptor
- [ ] Error handling

### **Steg 5: Testing** (1 timme)
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end flow

**Total tid:** ~5-7 timmar

---

## Nästa Steg

Ska vi börja med **Steg 1: Database Schema**?
