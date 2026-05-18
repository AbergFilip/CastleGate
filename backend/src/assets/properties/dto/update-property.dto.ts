import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const PROPERTY_TYPES = ['home', 'apartment', 'house', 'cottage', 'other'] as const;

export class UpdatePropertyDto {
  @ApiPropertyOptional({ description: 'Property type', enum: PROPERTY_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(PROPERTY_TYPES)
  type?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Property type (e.g. Lägenhet, Villa)' })
  @IsOptional()
  @IsString()
  property_type?: string;

  @ApiPropertyOptional({ description: 'Size in square meters' })
  @IsOptional()
  @IsNumber()
  size_sqm?: number;

  @ApiPropertyOptional({ description: 'Number of rooms' })
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @ApiPropertyOptional({ description: 'Floor' })
  @IsOptional()
  @IsString()
  floor?: string;

  @ApiPropertyOptional({ description: 'Purchase date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  purchase_date?: string;

  @ApiPropertyOptional({ description: 'Purchase price' })
  @IsOptional()
  @IsNumber()
  purchase_price?: number;

  @ApiPropertyOptional({ description: 'Current value' })
  @IsOptional()
  @IsNumber()
  current_value?: number;

  @ApiPropertyOptional({ description: 'Valuation date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  valuation_date?: string;

  @ApiPropertyOptional({ description: 'Valuation source' })
  @IsOptional()
  @IsString()
  valuation_source?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;
}
