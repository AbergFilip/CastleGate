import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateGradeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  education_level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  school_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  program?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  courses?: unknown[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  document_id?: string;
}
