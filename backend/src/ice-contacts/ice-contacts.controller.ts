import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IceContactsService } from './ice-contacts.service';
import { CreateIceContactDto } from './dto/create-ice-contact.dto';
import { UpdateIceContactDto } from './dto/update-ice-contact.dto';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('ICE contacts')
@Controller('ice-contacts')
@ApiBearerAuth()
export class IceContactsController {
  constructor(private readonly iceContactsService: IceContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List ICE contacts for current user' })
  async list(@CurrentUserId() userId: string) {
    return this.iceContactsService.getContacts(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create ICE contact' })
  async create(@CurrentUserId() userId: string, @Body() dto: CreateIceContactDto) {
    return this.iceContactsService.createContact(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ICE contact' })
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateIceContactDto,
  ) {
    return this.iceContactsService.updateContact(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete ICE contact' })
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.iceContactsService.deleteContact(userId, id);
  }
}
