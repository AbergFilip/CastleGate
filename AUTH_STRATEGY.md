# CastleGate Authentication Strategy

## Overview

CastleGate uses **BankID as the sole authentication method**. All users sign up and log in via Swedish BankID, which provides strong identity verification without passwords.

Under the hood, Supabase handles session management: the backend issues magic-link tokens after successful BankID verification, and these tokens establish Supabase sessions in the frontend.

## Authentication Flow

```
1. User opens app → AuthLanding shows BankID button
2. User clicks "Logga in med BankID" → BankIDAuth page
3. Frontend calls backend /bankid/auth endpoint
4. Backend initiates BankID auth, returns orderRef + QR data
5. User scans QR / opens BankID app
6. Frontend polls /bankid/collect until complete
7. Backend verifies BankID, creates/finds Supabase user, returns magic-link token
8. Frontend calls supabase.auth.verifyOtp() to establish session
9. User is redirected to /home
```

## Token Resolution (`getAuthToken`)

The `getAuthToken()` function in `src/lib/auth.ts` returns the Supabase access token:

```typescript
const { data: { session } } = await supabase.auth.getSession()
return session?.access_token || null
```

All API calls to the backend should include this token as `Authorization: Bearer <token>`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_BANKID_API_URL` | BankID API endpoint |
| `VITE_SESSION_TIMEOUT_MINUTES` | Inactivity timeout (default: 15) |

## Session Management

- Sessions are stored in Supabase and persisted via `localStorage`
- An inactivity timer in `AuthContext` logs users out after `VITE_SESSION_TIMEOUT_MINUTES` of no activity
- Session refresh is handled automatically by Supabase client

## Security Considerations

1. **No passwords** – BankID provides 2FA by design (something you have + PIN/biometrics)
2. **Personal number** – Only stored encrypted in the database; frontend displays masked values
3. **Session tokens** – Short-lived JWTs; refresh handled by Supabase
4. **Backend validation** – All sensitive operations require valid JWT verification on the backend

## Testing Without BankID

For development/CI, you can:
1. Set `VITE_SKIP_BANKID=true` to bypass QR scanning in sandbox mode
2. Use Supabase test accounts directly (if backend supports alternative auth in dev)
3. Mock the BankID response in integration tests

## Migration Notes (April 2026)

Auth0 was previously available as an alternative provider but has been removed to simplify the authentication model. CastleGate now uses BankID exclusively for all user authentication.
