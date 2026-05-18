import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle type', enum: ['car', 'motorcycle', 'trailer', 'other'] })
  @IsString()
  @IsIn(['car', 'motorcycle', 'trailer', 'other'])
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: 'Manufacturer/make', example: 'Volvo' })
  @IsString()
  @IsNotEmpty()
  make!: string;

  @ApiProperty({ description: 'Model', example: 'XC90' })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiPropertyOptional({ description: 'Registration number' })
  @IsOptional()
  @IsString()
  registration_number?: string;

  @ApiPropertyOptional({ description: 'Year' })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({ description: 'Color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'VIN (Vehicle Identification Number)' })
  @IsOptional()
  @IsString()
  vin?: string;

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
}
