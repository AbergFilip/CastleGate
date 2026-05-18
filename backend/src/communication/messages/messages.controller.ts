import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

@ApiTags('Communication - Messages')
@Controller('messages')
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all messages for current user' })
  async getMessages(@CurrentUserId() userId: string) {
    return this.messagesService.getMessages(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a message by ID' })
  async getMessageById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.messagesService.getMessageById(userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Send a new message' })
  async createMessage(@CurrentUserId() userId: string, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(userId, createMessageDto);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  async markAsRead(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.messagesService.markAsRead(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  async deleteMessage(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.messagesService.deleteMessage(userId, id);
  }
}

