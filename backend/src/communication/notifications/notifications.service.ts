import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

export interface Notification {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description?: string;
  type?: string;
  reference_id?: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getNotifications(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching notifications: ${error.message}`);
        throw new Error('Could not fetch notifications');
      }

      return data || [];
    } catch (error: any) {
      this.logger.error(`Error fetching notifications: ${error.message}`);
      throw new Error('Could not fetch notifications');
    }
  }

  async createNotification(createDto: CreateNotificationDto) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('notifications')
        .insert({
          user_id: createDto.userId,
          category: createDto.category,
          title: createDto.title,
          description: createDto.description || null,
          type: createDto.type || null,
          reference_id: createDto.referenceId || null,
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating notification: ${error.message}`);
        throw new Error('Could not create notification');
      }

      return data;
    } catch (error: any) {
      this.logger.error(`Error creating notification: ${error.message}`);
      throw new Error('Could not create notification');
    }
  }

  async markAsRead(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Notification not found');
      }

      return data;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error marking notification as read: ${error.message}`);
      throw new Error('Could not update notification');
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false)
        .select();

      if (error) {
        this.logger.error(`Error marking all notifications as read: ${error.message}`);
        throw new Error('Could not update notifications');
      }

      return data || [];
    } catch (error: any) {
      this.logger.error(`Error marking all notifications as read: ${error.message}`);
      throw new Error('Could not update notifications');
    }
  }

  async deleteNotification(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Notification not found');
      }

      return { message: 'Notification deleted' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting notification: ${error.message}`);
      throw new Error('Could not delete notification');
    }
  }
}
