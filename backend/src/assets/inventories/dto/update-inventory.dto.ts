import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateInventoryDto {
  @ApiPropertyOptional({ enum: ['appliance', 'belonging'] })
  @IsOptional()
  @IsString()
  @IsIn(['appliance', 'belonging'])
  type?: 'appliance' | 'belonging';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serial_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;
}
