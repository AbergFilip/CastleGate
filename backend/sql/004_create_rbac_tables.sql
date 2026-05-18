-- RBAC (Role-Based Access Control) Tables
-- Migrerad från Supabase: RLS policies borttagna (hanteras i backend)

-- 1. Roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(100) NOT NULL, -- e.g., 'documents', 'users', 'assets'
  action VARCHAR(50) NOT NULL, -- e.g., 'read', 'write', 'delete', 'admin'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Role-Permission mapping (many-to-many)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. User-Role mapping (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES public.users(id),
  PRIMARY KEY (user_id, role_id)
);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON public.permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON public.permissions(action);

-- 6. Triggers for updated_at
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert initial roles
INSERT INTO public.roles (name, description) VALUES
  ('B2C_USER', 'Standard B2C consumer user'),
  ('B2B_USER', 'Standard B2B business user'),
  ('B2B_ADMIN', 'B2B organization administrator'),
  ('SYSTEM_ADMIN', 'System administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- 8. Insert common permissions
INSERT INTO public.permissions (name, resource, action, description) VALUES
  -- Documents permissions
  ('documents:read', 'documents', 'read', 'Read own documents'),
  ('documents:write', 'documents', 'write', 'Create and update own documents'),
  ('documents:delete', 'documents', 'delete', 'Delete own documents'),
  ('documents:admin', 'documents', 'admin', 'Full access to all documents'),
  
  -- Users permissions
  ('users:read', 'users', 'read', 'Read user information'),
  ('users:write', 'users', 'write', 'Update user information'),
  ('users:admin', 'users', 'admin', 'Full user management'),
  
  -- Assets permissions
  ('assets:read', 'assets', 'read', 'Read own assets'),
  ('assets:write', 'assets', 'write', 'Create and update own assets'),
  ('assets:delete', 'assets', 'delete', 'Delete own assets'),
  ('assets:admin', 'assets', 'admin', 'Full access to all assets'),
  
  -- Economy permissions
  ('economy:read', 'economy', 'read', 'Read own economy data'),
  ('economy:write', 'economy', 'write', 'Create and update own economy data'),
  ('economy:admin', 'economy', 'admin', 'Full access to economy data'),
  
  -- Network permissions
  ('network:read', 'network', 'read', 'Read network connections'),
  ('network:write', 'network', 'write', 'Manage network connections'),
  ('network:admin', 'network', 'admin', 'Full network management'),
  
  -- System permissions
  ('system:admin', 'system', 'admin', 'Full system access')
ON CONFLICT (name) DO NOTHING;

-- 9. Assign default permissions to roles
-- B2C_USER gets basic read/write for own resources
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'B2C_USER'
  AND p.name IN (
    'documents:read', 'documents:write', 'documents:delete',
    'assets:read', 'assets:write', 'assets:delete',
    'economy:read', 'economy:write',
    'network:read', 'network:write',
    'users:read'
  )
ON CONFLICT DO NOTHING;

-- B2B_USER gets same as B2C_USER
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'B2B_USER'
  AND p.name IN (
    'documents:read', 'documents:write', 'documents:delete',
    'assets:read', 'assets:write', 'assets:delete',
    'economy:read', 'economy:write',
    'network:read', 'network:write',
    'users:read'
  )
ON CONFLICT DO NOTHING;

-- B2B_ADMIN gets admin permissions for organization
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'B2B_ADMIN'
  AND p.name IN (
    'documents:read', 'documents:write', 'documents:delete', 'documents:admin',
    'assets:read', 'assets:write', 'assets:delete', 'assets:admin',
    'economy:read', 'economy:write', 'economy:admin',
    'network:read', 'network:write', 'network:admin',
    'users:read', 'users:write'
  )
ON CONFLICT DO NOTHING;

-- SYSTEM_ADMIN gets all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'SYSTEM_ADMIN'
ON CONFLICT DO NOTHING;

-- 10. Comments
COMMENT ON TABLE public.roles IS 'RBAC roles';
COMMENT ON TABLE public.permissions IS 'RBAC permissions';
COMMENT ON TABLE public.role_permissions IS 'Role-Permission mapping';
COMMENT ON TABLE public.user_roles IS 'User-Role assignment';
