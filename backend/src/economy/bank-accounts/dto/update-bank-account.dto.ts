import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBankAccountDto {
  @ApiPropertyOptional({ description: 'Bank name' })
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ description: 'Account name' })
  @IsString()
  @IsOptional()
  account_name?: string;

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

  @ApiPropertyOptional({ description: 'Currency' })
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

  @ApiPropertyOptional({ description: 'Is active' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

