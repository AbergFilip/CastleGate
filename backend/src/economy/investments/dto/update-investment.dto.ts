import { IsString, IsOptional, IsNumber, IsBoolean, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInvestmentDto {
  @ApiPropertyOptional({ description: 'Investment provider' })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({ description: 'Account name' })
  @IsString()
  @IsOptional()
  account_name?: string;

  @ApiPropertyOptional({ description: 'Investment type' })
  @IsString()
  @IsOptional()
  investment_type?: string;

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

  @ApiPropertyOptional({ description: 'Currency' })
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

  @ApiPropertyOptional({ description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

