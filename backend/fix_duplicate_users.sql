-- Fix script för duplicate users
-- Kör detta script i Supabase SQL Editor för att fixa duplicate key-problem

-- 1. Hitta dubbletter i users-tabellen
SELECT id, email, personal_number, COUNT(*) as count
FROM public.users
GROUP BY id, email, personal_number
HAVING COUNT(*) > 1;

-- 2. Hitta användare som finns i auth.users men inte i public.users
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 3. Hitta användare som finns i public.users men inte i auth.users
SELECT pu.id, pu.email
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- 4. Ta bort användare som finns i public.users men inte i auth.users
DELETE FROM public.users
WHERE id NOT IN (SELECT id FROM auth.users);

-- 5. Skapa saknade användare i public.users för användare som finns i auth.users
INSERT INTO public.users (id, email, name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email) as name
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 6. Verifiera att allt är korrekt
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM public.users) as public_users,
  (SELECT COUNT(*) FROM auth.users au 
   INNER JOIN public.users pu ON au.id = pu.id) as linked_users;

