import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const PROPERTY_TYPES = ['home', 'apartment', 'house', 'cottage', 'other'] as const;

export class CreatePropertyDto {
  @ApiProperty({ description: 'Property type', enum: PROPERTY_TYPES })
  @IsString()
  @IsIn(PROPERTY_TYPES)
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: 'Address' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ description: 'Country', default: 'Sverige' })
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

  @ApiPropertyOptional({ description: 'Floor (e.g. 5tr, Bottenvåning)' })
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

  @ApiPropertyOptional({ description: 'Current estimated value' })
  @IsOptional()
  @IsNumber()
  current_value?: number;

  @ApiPropertyOptional({ description: 'Valuation date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  valuation_date?: string;

  @ApiPropertyOptional({ description: 'Valuation source (e.g. Hemnet, Booli)' })
  @IsOptional()
  @IsString()
  valuation_source?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;
}
