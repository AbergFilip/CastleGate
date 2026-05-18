import { IsString, IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCardDto {
  @ApiPropertyOptional({ description: 'Card type' })
  @IsString()
  @IsOptional()
  @IsIn(['debit', 'credit', 'other_credit'])
  card_type?: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ description: 'Card name' })
  @IsString()
  @IsOptional()
  card_name?: string;

  @ApiPropertyOptional({ description: 'Last four digits' })
  @IsString()
  @IsOptional()
  last_four?: string;

  @ApiPropertyOptional({ description: 'Full card number' })
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

  @ApiPropertyOptional({ description: 'Currency' })
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

  @ApiPropertyOptional({ description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

