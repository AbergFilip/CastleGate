import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserType, UserTypeMetadata } from './dto/user-type.dto';

export interface User {
  id: string;
  email: string;
  name?: string;
  personal_number?: string;
  bankid_linked?: boolean;
  bankid_linked_at?: Date;
  user_type?: string;
  organization_id?: string;
  organization_name?: string;
  metadata?: any;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .select(
          'id, email, name, personal_number, bankid_linked, bankid_linked_at, user_type, organization_id, organization_name, metadata, created_at, updated_at'
        )
        .eq('id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException('User not found');
      }

      return data;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching user: ${error.message}`);
      throw new Error('Could not fetch user');
    }
  }

  /**
   * Get user type
   */
  async getUserType(userId: string): Promise<UserType> {
    const user = await this.getUserById(userId);
    return (user.user_type as UserType) || UserType.B2C;
  }

  /**
   * Set user type
   */
  async setUserType(userId: string, userType: UserType, metadata?: UserTypeMetadata) {
    const updates: any = { user_type: userType };

    if (userType === UserType.B2B && metadata) {
      if (metadata.organizationId) {
        updates.organization_id = metadata.organizationId;
      }
      if (metadata.organizationName) {
        updates.organization_name = metadata.organizationName;
      }
    }

    updates.updated_at = new Date().toISOString();

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('User not found');
      }

      return data;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update user type: ${error.message}`);
      throw new Error(`Failed to update user type: ${error.message}`);
    }
  }

  /**
   * Get user metadata
   */
  async getUserMetadata(userId: string): Promise<UserTypeMetadata> {
    const user = await this.getUserById(userId);
    return {
      type: (user.user_type as UserType) || UserType.B2C,
      organizationId: user.organization_id,
      organizationName: user.organization_name,
    };
  }

  /**
   * Check if user is B2B
   */
  async isB2B(userId: string): Promise<boolean> {
    const userType = await this.getUserType(userId);
    return userType === UserType.B2B;
  }

  /**
   * Check if user is B2C
   */
  async isB2C(userId: string): Promise<boolean> {
    const userType = await this.getUserType(userId);
    return userType === UserType.B2C;
  }
}
