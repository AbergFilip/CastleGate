import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssistantRequestDto {
  @ApiProperty({ description: 'User query or question' })
  @IsString()
  @IsNotEmpty()
  query!: string;

  @ApiPropertyOptional({ description: 'Context or conversation history' })
  @IsArray()
  @IsOptional()
  context?: string[];

  @ApiPropertyOptional({ description: 'Assistant type (CPA/MPA)' })
  @IsString()
  @IsOptional()
  assistantType?: 'CPA' | 'MPA';
}

