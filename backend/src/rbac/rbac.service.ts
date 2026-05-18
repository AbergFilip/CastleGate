import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Check if user has permission
   */
  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    try {
      // Get user roles
      const { data: userRoles } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      if (!userRoles || userRoles.length === 0) {
        return false;
      }

      const roleIds = userRoles.map((ur: any) => ur.role_id);

      // Get role permissions
      const { data: rolePermissions } = await this.supabaseService
        .getClient()
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds);

      if (!rolePermissions || rolePermissions.length === 0) {
        return false;
      }

      const permissionIds = rolePermissions.map((rp: any) => rp.permission_id);

      // Check if permission exists
      const { data: permissions } = await this.supabaseService
        .getClient()
        .from('permissions')
        .select('name')
        .eq('name', permissionName)
        .in('id', permissionIds)
        .limit(1);

      return (permissions?.length || 0) > 0;
    } catch (error: any) {
      this.logger.error(`Error checking permission: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
    if (permissionNames.length === 0) {
      return false;
    }

    try {
      // Get user roles
      const { data: userRoles } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      if (!userRoles || userRoles.length === 0) {
        return false;
      }

      const roleIds = userRoles.map((ur: any) => ur.role_id);

      // Get role permissions
      const { data: rolePermissions } = await this.supabaseService
        .getClient()
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds);

      if (!rolePermissions || rolePermissions.length === 0) {
        return false;
      }

      const permissionIds = rolePermissions.map((rp: any) => rp.permission_id);

      // Check if any permission exists
      const { data: permissions } = await this.supabaseService
        .getClient()
        .from('permissions')
        .select('name')
        .in('name', permissionNames)
        .in('id', permissionIds)
        .limit(1);

      return (permissions?.length || 0) > 0;
    } catch (error: any) {
      this.logger.error(`Error checking permissions: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if user has all of the specified permissions
   */
  async hasAllPermissions(userId: string, permissionNames: string[]): Promise<boolean> {
    if (permissionNames.length === 0) {
      return true;
    }

    try {
      // Get user roles
      const { data: userRoles } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      if (!userRoles || userRoles.length === 0) {
        return false;
      }

      const roleIds = userRoles.map((ur: any) => ur.role_id);

      // Get role permissions
      const { data: rolePermissions } = await this.supabaseService
        .getClient()
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds);

      if (!rolePermissions || rolePermissions.length === 0) {
        return false;
      }

      const permissionIds = rolePermissions.map((rp: any) => rp.permission_id);

      // Check if all permissions exist
      const { data: permissions } = await this.supabaseService
        .getClient()
        .from('permissions')
        .select('name')
        .in('name', permissionNames)
        .in('id', permissionIds);

      const foundNames = (permissions || []).map((p: any) => p.name);
      return foundNames.length === permissionNames.length;
    } catch (error: any) {
      this.logger.error(`Error checking permissions: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if user has role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    try {
      // Get role by name
      const { data: role } = await this.supabaseService
        .getClient()
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single();

      if (!role) {
        return false;
      }

      // Check if user has this role
      const { data: userRole } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role_id', role.id)
        .limit(1);

      return (userRole?.length || 0) > 0;
    } catch (error: any) {
      this.logger.error(`Error checking role: ${error.message}`);
      return false;
    }
  }

  /**
   * Get all roles for a user
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      // Get user roles
      const { data: userRoles } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      const roleIds = userRoles.map((ur: any) => ur.role_id);

      // Get roles
      const { data: roles } = await this.supabaseService
        .getClient()
        .from('roles')
        .select('id, name, description')
        .in('id', roleIds);

      return roles || [];
    } catch (error: any) {
      this.logger.error(`Error fetching user roles: ${error.message}`);
      return [];
    }
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      // Get user roles
      const { data: userRoles } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      const roleIds = userRoles.map((ur: any) => ur.role_id);

      // Get role permissions
      const { data: rolePermissions } = await this.supabaseService
        .getClient()
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds);

      if (!rolePermissions || rolePermissions.length === 0) {
        return [];
      }

      const permissionIds = [...new Set(rolePermissions.map((rp: any) => rp.permission_id))];

      // Get permissions
      const { data: permissions } = await this.supabaseService
        .getClient()
        .from('permissions')
        .select('id, name, resource, action, description')
        .in('id', permissionIds);

      return permissions || [];
    } catch (error: any) {
      this.logger.error(`Error fetching user permissions: ${error.message}`);
      return [];
    }
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, roleId: string, assignedBy?: string): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .upsert(
          {
            user_id: userId,
            role_id: roleId,
            assigned_by: assignedBy || null,
          },
          {
            onConflict: 'user_id,role_id',
            ignoreDuplicates: true,
          }
        );

      if (error) {
        this.logger.error(`Error assigning role: ${error.message}`);
        throw new Error(`Failed to assign role: ${error.message}`);
      }
    } catch (error: any) {
      this.logger.error(`Error assigning role: ${error.message}`);
      throw new Error(`Failed to assign role: ${error.message}`);
    }
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        this.logger.error(`Error removing role: ${error.message}`);
        throw new Error(`Failed to remove role: ${error.message}`);
      }
    } catch (error: any) {
      this.logger.error(`Error removing role: ${error.message}`);
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  }

  /**
   * Get all available roles
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('roles')
        .select('id, name, description')
        .order('name', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching roles: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (error: any) {
      this.logger.error(`Error fetching roles: ${error.message}`);
      return [];
    }
  }

  /**
   * Get all available permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('permissions')
        .select('id, name, resource, action, description')
        .order('resource', { ascending: true })
        .order('action', { ascending: true });

      if (error) {
        this.logger.error(`Error fetching permissions: ${error.message}`);
        return [];
      }

      return data || [];
    } catch (error: any) {
      this.logger.error(`Error fetching permissions: ${error.message}`);
      return [];
    }
  }
}
