import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @IsNotEmpty()
  bank_name!: string;

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  account_name!: string;

  @ApiPropertyOptional({ description: 'Account number' })
  @IsString()
  @IsOptional()
  account_number?: string;

  @ApiPropertyOptional({ description: 'Account type' })
  @IsString()
  @IsOptional()
  account_type?: string;

  @ApiPropertyOptional({ description: 'Balance' })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional({ description: 'Currency', default: 'SEK' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'IBAN' })
  @IsString()
  @IsOptional()
  iban?: string;

  @ApiPropertyOptional({ description: 'SWIFT code' })
  @IsString()
  @IsOptional()
  swift?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

