import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoatDto {
  @ApiPropertyOptional({ description: 'Boat type', enum: ['motorboat', 'sailboat', 'other'] })
  @IsOptional()
  @IsString()
  @IsIn(['motorboat', 'sailboat', 'other'])
  type?: string;

  @ApiPropertyOptional({ description: 'Manufacturer/make' })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({ description: 'Model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Registration number' })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @ApiPropertyOptional({ description: 'Year' })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({ description: 'Length in meters' })
  @IsOptional()
  @IsNumber()
  length?: number;

  @ApiPropertyOptional({ description: 'Engine type' })
  @IsOptional()
  @IsString()
  engine_type?: string;

  @ApiPropertyOptional({ description: 'Engine power' })
  @IsOptional()
  @IsString()
  engine_power?: string;

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

  @ApiPropertyOptional({ description: 'Insurance policy number' })
  @IsOptional()
  @IsString()
  insurance_policy_number?: string;

  @ApiPropertyOptional({ description: 'Insurance company' })
  @IsOptional()
  @IsString()
  insurance_company?: string;

  @ApiPropertyOptional({ description: 'Insurance expiry date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  insurance_expiry?: string;

  @ApiPropertyOptional({ description: 'Mooring location' })
  @IsOptional()
  @IsString()
  mooring_location?: string;
}
