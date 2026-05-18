import { IsString, IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLoanDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsIn(['mortgage', 'personal', 'car', 'student', 'other'])
  loan_type?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  loan_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  remaining_amount?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  interest_rate?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  monthly_payment?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
