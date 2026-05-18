import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ description: 'Request title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Request description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Request category' })
  @IsString()
  @IsNotEmpty()
  category!: string;
}

