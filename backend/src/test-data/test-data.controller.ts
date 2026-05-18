import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';
import { TestDataService } from './test-data.service';

@ApiTags('Test data')
@Controller('test-data')
@ApiBearerAuth()
export class TestDataController {
  private readonly logger = new Logger(TestDataController.name);

  constructor(
    private readonly testDataService: TestDataService,
    private readonly configService: ConfigService,
  ) {}

  @Post('clear-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rensa all apptestdata för inloggad användare',
    description:
      'Kräver ENABLE_TEST_DATA_TOOLS=true. Tar bort konton, kort, transaktioner, tillgångar, nätverk, meddelanden m.m. Profil och inloggning behålls.',
  })
  @ApiResponse({ status: 200, description: 'Rensning klar' })
  @ApiResponse({ status: 404, description: 'Funktionen är avstängd' })
  async clearAll(@CurrentUserId() userId: string) {
    if (this.configService.get<string>('ENABLE_TEST_DATA_TOOLS') !== 'true') {
      throw new NotFoundException();
    }
    if (!userId) {
      throw new NotFoundException();
    }
    const result = await this.testDataService.clearAllForUser(userId);
    this.logger.log(`clear-all completed for user ${userId}, ${result.totalRows} rows`);
    return result;
  }
}
