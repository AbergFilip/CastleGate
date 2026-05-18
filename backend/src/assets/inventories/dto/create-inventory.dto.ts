import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ enum: ['appliance', 'belonging'] })
  @IsString()
  @IsIn(['appliance', 'belonging'])
  type!: 'appliance' | 'belonging';

  @ApiProperty()
  @IsString()
  @MinLength(1)
  category!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;

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
