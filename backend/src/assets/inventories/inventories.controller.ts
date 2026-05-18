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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';

@ApiTags('Inventories')
@Controller('inventories')
@ApiBearerAuth()
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List inventories for current user' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getInventories(
    @CurrentUserId() userId: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return await this.inventoriesService.getInventories(userId, { type, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one inventory' })
  async getById(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.inventoriesService.getInventoryById(userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inventory' })
  async create(
    @CurrentUserId() userId: string,
    @Body() dto: CreateInventoryDto,
  ) {
    return await this.inventoriesService.createInventory(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update inventory' })
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    return await this.inventoriesService.updateInventory(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete inventory' })
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    return await this.inventoriesService.deleteInventory(userId, id);
  }
}
