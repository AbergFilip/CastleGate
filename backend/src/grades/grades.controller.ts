import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('Grades')
@Controller('grades')
@ApiBearerAuth()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  @ApiOperation({ summary: 'List grades for current user' })
  async list(
    @CurrentUserId() userId: string,
    @Query('education_level') educationLevel?: string,
  ) {
    return this.gradesService.getGrades(userId, educationLevel);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create grade record' })
  async create(@CurrentUserId() userId: string, @Body() dto: CreateGradeDto) {
    return this.gradesService.createGrade(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update grade record' })
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateGradeDto,
  ) {
    return this.gradesService.updateGrade(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete grade record' })
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.gradesService.deleteGrade(userId, id);
  }
}
