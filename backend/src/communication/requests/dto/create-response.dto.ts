import { IsString, IsNotEmpty, IsOptional, IsUUID, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({ description: 'Response message' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'Price details' })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({ description: 'Contact info (JSON)' })
  @IsOptional()
  contactInfo?: any;
}

