import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateMessageDto } from './dto/create-message.dto';

export interface Message {
  id: string;
  sender_id?: string;
  recipient_id: string;
  sender_name: string;
  sender_type?: string;
  subject?: string;
  content: string;
  read: boolean;
  category?: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getMessages(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('messages')
        .select('*')
        .or(`recipient_id.eq.${userId},sender_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Error fetching messages: ${error.message}`);
        throw new Error('Could not fetch messages');
      }

      return data || [];
    } catch (error: any) {
      this.logger.error(`Error fetching messages: ${error.message}`);
      throw new Error('Could not fetch messages');
    }
  }

  async getMessageById(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('messages')
        .select('*')
        .eq('id', id)
        .or(`recipient_id.eq.${userId},sender_id.eq.${userId}`)
        .single();

      if (error || !data) {
        throw new NotFoundException('Message not found');
      }

      return data;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching message: ${error.message}`);
      throw new Error('Could not fetch message');
    }
  }

  async createMessage(senderId: string, createMessageDto: CreateMessageDto) {
    try {
      // Get sender details (name)
      const { data: userData } = await this.supabaseService
        .getClient()
        .from('users')
        .select('name')
        .eq('id', senderId)
        .single();

      const senderName = userData?.name || 'Unknown';

      const { data, error } = await this.supabaseService
        .getClient()
        .from('messages')
        .insert({
          sender_id: senderId,
          recipient_id: createMessageDto.recipientId,
          sender_name: senderName,
          subject: createMessageDto.subject || null,
          content: createMessageDto.content,
          category: createMessageDto.category || 'person',
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating message: ${error.message}`);
        throw new Error('Could not create message');
      }

      return data;
    } catch (error: any) {
      this.logger.error(`Error creating message: ${error.message}`);
      throw new Error('Could not create message');
    }
  }

  async markAsRead(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('messages')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('recipient_id', userId)
        .select()
        .single();

      if (error || !data) {
        throw new NotFoundException('Message not found');
      }

      return data;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error marking message as read: ${error.message}`);
      throw new Error('Could not update message');
    }
  }

  async deleteMessage(userId: string, id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('messages')
        .delete()
        .eq('id', id)
        .or(`recipient_id.eq.${userId},sender_id.eq.${userId}`)
        .select('id')
        .single();

      if (error || !data) {
        throw new NotFoundException('Message not found');
      }

      return { message: 'Message deleted successfully' };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting message: ${error.message}`);
      throw new Error('Could not delete message');
    }
  }
}
