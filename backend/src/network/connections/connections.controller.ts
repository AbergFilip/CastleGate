import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@ApiTags('Connections')
@Controller('connections')
@ApiBearerAuth()
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  async getConnections(@CurrentUserId() userId: string) {
    return await this.connectionsService.getConnections(userId);
  }

  @Get(':id')
  async getConnectionById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.connectionsService.getConnectionById(userId, id);
  }

  @Post()
  async createConnection(@CurrentUserId() userId: string, @Body() createDto: CreateConnectionDto) {
    return await this.connectionsService.createConnection(userId, createDto);
  }

  @Put(':id')
  async updateConnection(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateConnectionDto
  ) {
    return await this.connectionsService.updateConnection(userId, id, updateDto);
  }

  @Delete(':id')
  async deleteConnection(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.connectionsService.deleteConnection(userId, id);
  }
}

