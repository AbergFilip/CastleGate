import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query string', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  q!: string;
}
