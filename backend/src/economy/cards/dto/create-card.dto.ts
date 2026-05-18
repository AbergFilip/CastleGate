import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'Card type', enum: ['debit', 'credit', 'other_credit'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['debit', 'credit', 'other_credit'])
  card_type!: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiProperty({ description: 'Card name' })
  @IsString()
  @IsNotEmpty()
  card_name!: string;

  @ApiPropertyOptional({ description: 'Last four digits' })
  @IsString()
  @IsOptional()
  last_four?: string;

  @ApiPropertyOptional({ description: 'Full card number (encrypted)' })
  @IsString()
  @IsOptional()
  card_number?: string;

  @ApiPropertyOptional({ description: 'Balance' })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional({ description: 'Credit limit' })
  @IsNumber()
  @IsOptional()
  credit_limit?: number;

  @ApiPropertyOptional({ description: 'Available credit' })
  @IsNumber()
  @IsOptional()
  available_credit?: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'SEK' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Expiry date' })
  @IsString()
  @IsOptional()
  expiry_date?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

