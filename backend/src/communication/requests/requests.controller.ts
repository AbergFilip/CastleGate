import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateResponseDto } from './dto/create-response.dto';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

@ApiTags('Communication - Requests')
@Controller('requests')
@ApiBearerAuth()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all requests (marketplace)' })
  async getRequests() {
    return this.requestsService.getRequests();
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my requests' })
  async getMyRequests(@CurrentUserId() userId: string) {
    return this.requestsService.getMyRequests(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  async getRequestById(@Param('id') id: string) {
    return this.requestsService.getRequestById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  async createRequest(@CurrentUserId() userId: string, @Body() createDto: CreateRequestDto) {
    return this.requestsService.createRequest(userId, createDto);
  }

  @Post(':id/respond')
  @ApiOperation({ summary: 'Respond to a request' })
  async createResponse(
    @CurrentUserId() userId: string,
    @Param('id') requestId: string,
    @Body() createDto: CreateResponseDto
  ) {
    return this.requestsService.createResponse(userId, requestId, createDto);
  }
}

