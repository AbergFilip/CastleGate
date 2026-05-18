import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @ApiPropertyOptional({ description: 'Transaction date' })
  @IsDateString()
  @IsOptional()
  transaction_date?: string;

  @ApiPropertyOptional({ description: 'Amount' })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'Currency' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Merchant name' })
  @IsString()
  @IsOptional()
  merchant?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Transaction type',
    enum: ['debit', 'credit', 'transfer'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['debit', 'credit', 'transfer'])
  transaction_type?: string;

  @ApiPropertyOptional({ description: 'Reference' })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

