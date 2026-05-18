import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

@ApiTags('Communication - Notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  async getNotifications(@CurrentUserId() userId: string) {
    return this.notificationsService.getNotifications(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create notification for current user' })
  async createNotification(@CurrentUserId() userId: string, @Body() createDto: CreateNotificationDto) {
    return this.notificationsService.createNotification({ ...createDto, userId });
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUserId() userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  async deleteNotification(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(userId, id);
  }
}

