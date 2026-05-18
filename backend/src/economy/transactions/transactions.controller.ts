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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('bank-accounts/:accountId')
  @ApiOperation({ summary: 'Get transactions for a bank account' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bank account not found' })
  async getTransactionsByAccount(
    @CurrentUserId() userId: string,
    @Param('accountId') accountId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number
  ) {
    return await this.transactionsService.getTransactionsByAccount(
      userId,
      accountId,
      limit,
      offset
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createTransaction(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateTransactionDto
  ) {
    return await this.transactionsService.createTransaction(userId, createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async updateTransaction(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto
  ) {
    return await this.transactionsService.updateTransaction(userId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  async deleteTransaction(
    @CurrentUserId() userId: string,
    @Param('id') id: string
  ) {
    return await this.transactionsService.deleteTransaction(userId, id);
  }
}

