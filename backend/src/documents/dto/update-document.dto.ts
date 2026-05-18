import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'Document title' })
  @IsString()
  @IsOptional()
  title?: string;

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

