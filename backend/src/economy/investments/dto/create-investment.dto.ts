import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty({ description: 'Investment provider' })
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  account_name!: string;

  @ApiProperty({ description: 'Investment type' })
  @IsString()
  @IsNotEmpty()
  investment_type!: string;

  @ApiPropertyOptional({ description: 'Symbol/Code' })
  @IsString()
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ description: 'Amount' })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'Quantity' })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Purchase price' })
  @IsNumber()
  @IsOptional()
  purchase_price?: number;

  @ApiPropertyOptional({ description: 'Current price' })
  @IsNumber()
  @IsOptional()
  current_price?: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'SEK' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Growth percent' })
  @IsNumber()
  @IsOptional()
  growth_percent?: number;

  @ApiPropertyOptional({ description: 'Account type' })
  @IsString()
  @IsOptional()
  account_type?: string;

  @ApiPropertyOptional({ description: 'External URL' })
  @IsUrl()
  @IsOptional()
  external_url?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

