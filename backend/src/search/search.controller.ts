import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('Search')
@Controller('search')
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query (max 200 chars)' })
  async search(@CurrentUserId() userId: string, @Query() query: SearchQueryDto) {
    return this.searchService.search(userId, query.q);
  }
}

