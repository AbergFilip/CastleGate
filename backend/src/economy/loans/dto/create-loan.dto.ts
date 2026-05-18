import { IsString, IsOptional, IsNumber, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoanDto {
  @ApiProperty({ enum: ['mortgage', 'personal', 'car', 'student', 'other'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['mortgage', 'personal', 'car', 'student', 'other'])
  loan_type!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  loan_name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bank_name?: string;

  @ApiProperty()
  @IsNumber()
  amount!: number;

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
}
