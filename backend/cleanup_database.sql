-- Cleanup script för Supabase Database
-- Kör detta script i Supabase SQL Editor för att rensa alla användare
-- ⚠️ VIKTIGT: Detta tar bort ALLA användare och data!

-- 1. Ta bort alla användare från users-tabellen
DELETE FROM public.users;

-- 2. Ta bort alla användare från auth.users
-- OBS: Detta kräver att du körs som service_role
DELETE FROM auth.users;

-- 3. Verifiera att allt är rensat
SELECT COUNT(*) as users_count FROM public.users;
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- Om du bara vill ta bort specifika användare istället:
-- DELETE FROM public.users WHERE email LIKE '%@bankid.local';
-- DELETE FROM auth.users WHERE email LIKE '%@bankid.local';

