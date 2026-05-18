import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const CATEGORIES = [
  'property', 'inventory', 'vehicle', 'boat', 'bicycle', 'payment_protection',
  'income', 'healthcare', 'alarm', 'travel', 'funds',
] as const;

const FREQUENCIES = ['monthly', 'yearly'] as const;

export class CreateInsuranceDto {
  @ApiProperty({ description: 'Insurance category' })
  @IsString()
  @IsIn(CATEGORIES)
  category!: string;

  @ApiProperty({ description: 'Insurance type (e.g. Hemförsäkring, Mobilförsäkring)' })
  @IsString()
  type!: string;

  @ApiProperty({ description: 'Insurance company name' })
  @IsString()
  insurance_company!: string;

  @ApiPropertyOptional({ description: 'Policy number' })
  @IsOptional()
  @IsString()
  policy_number?: string;

  @ApiPropertyOptional({ description: 'Coverage amount' })
  @IsOptional()
  @IsNumber()
  coverage_amount?: number;

  @ApiPropertyOptional({ description: 'Premium amount' })
  @IsOptional()
  @IsNumber()
  premium?: number;

  @ApiPropertyOptional({ description: 'Premium frequency', enum: FREQUENCIES })
  @IsOptional()
  @IsString()
  @IsIn(FREQUENCIES)
  premium_frequency?: string;

  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Expiry date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @ApiPropertyOptional({ description: 'Renewal date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  renewal_date?: string;

  @ApiPropertyOptional({ description: 'Deductible (självrisk)' })
  @IsOptional()
  @IsNumber()
  deductible?: number;

  @ApiPropertyOptional({ description: 'Linked property/asset ID' })
  @IsOptional()
  @IsUUID()
  linked_property_id?: string;

  @ApiPropertyOptional({ description: 'Linked property type', enum: ['vehicle', 'boat', 'inventory', 'property'] })
  @IsOptional()
  @IsString()
  linked_property_type?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
