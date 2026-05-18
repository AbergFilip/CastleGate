import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TinkCallbackDto {
  @ApiPropertyOptional({ description: 'Tink credentials ID' })
  @IsOptional()
  @IsString()
  credentials_id?: string;

  @ApiPropertyOptional({ description: 'Tink account verification report ID (or accountVerificationReportId)' })
  @IsOptional()
  @IsString()
  account_verification_report_id?: string;

  @ApiPropertyOptional({ description: 'Alternative camelCase: account verification report ID' })
  @IsOptional()
  @IsString()
  accountVerificationReportId?: string;
}
