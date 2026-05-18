import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { AssistantRequestDto } from './dto/assistant-request.dto';

@ApiTags('AI Assistant')
@Controller('ai/assistant')
@ApiBearerAuth()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post()
  @ApiOperation({ summary: 'Process AI assistant query' })
  async processQuery(
    @CurrentUserId() userId: string,
    @Body() request: AssistantRequestDto
  ) {
    return await this.assistantService.processQuery(userId, request);
  }
}

