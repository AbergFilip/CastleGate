import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiPropertyOptional({ description: 'Bank account ID' })
  @IsUUID()
  @IsOptional()
  bank_account_id?: string;

  @ApiProperty({ description: 'Transaction date' })
  @IsDateString()
  @IsNotEmpty()
  transaction_date!: string;

  @ApiProperty({ description: 'Amount' })
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'SEK' })
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
    default: 'debit',
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

