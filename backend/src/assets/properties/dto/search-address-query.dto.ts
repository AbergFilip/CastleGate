import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchAddressQueryDto {
  @ApiProperty({ description: 'Search query for address', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  q!: string;

  @ApiPropertyOptional({ description: 'Maximum number of results', default: 15 })
  @IsOptional()
  @IsString()
  maxHits?: string;
}
