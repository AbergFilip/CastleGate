import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty({ description: 'Offer title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Offer description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Offer category' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ description: 'Offer badge (e.g. New, Sale)' })
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiProperty({ description: 'Offer price text' })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({ description: 'Offer type' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Link URL' })
  @IsString()
  @IsOptional()
  linkUrl?: string;
}

