import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CreateSchoolContactDto } from './dto/create-school-contact.dto';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('Schools')
@Controller('schools')
@ApiBearerAuth()
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  @ApiOperation({ summary: 'List schools for current user' })
  async list(
    @CurrentUserId() userId: string,
    @Query('type') type?: string,
  ) {
    return this.schoolsService.getSchools(userId, type);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create school' })
  async create(@CurrentUserId() userId: string, @Body() dto: CreateSchoolDto) {
    return this.schoolsService.createSchool(userId, dto);
  }

  @Get(':schoolId/contacts')
  @ApiOperation({ summary: 'List contacts for a school' })
  async listContacts(
    @CurrentUserId() userId: string,
    @Param('schoolId') schoolId: string,
  ) {
    return this.schoolsService.getContacts(userId, schoolId);
  }

  @Post(':schoolId/contacts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add contact to school' })
  async createContact(
    @CurrentUserId() userId: string,
    @Param('schoolId') schoolId: string,
    @Body() dto: CreateSchoolContactDto,
  ) {
    return this.schoolsService.createContact(userId, schoolId, dto);
  }

  @Delete(':schoolId/contacts/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete school contact' })
  async deleteContact(
    @CurrentUserId() userId: string,
    @Param('schoolId') schoolId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.schoolsService.deleteContact(userId, schoolId, contactId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete school' })
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.schoolsService.deleteSchool(userId, id);
  }
}
