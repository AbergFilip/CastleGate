import { IsString, IsOptional, IsObject, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Document category' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional({ description: 'Document subcategory' })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty({ description: 'Document title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'File URL' })
  @IsString()
  @IsOptional()
  file_url?: string;

  @ApiPropertyOptional({ description: 'File name' })
  @IsString()
  @IsOptional()
  file_name?: string;

  @ApiPropertyOptional({ description: 'File type' })
  @IsString()
  @IsOptional()
  file_type?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsNumber()
  @IsOptional()
  file_size?: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

