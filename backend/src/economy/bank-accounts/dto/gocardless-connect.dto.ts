import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GoCardlessConnectDto {
  @ApiPropertyOptional({ description: 'GoCardless institution ID', default: 'SANDBOXFINANCE_SFIN0000' })
  @IsOptional()
  @IsString()
  institution_id?: string;

  @ApiPropertyOptional({ description: 'Redirect URI after bank authentication' })
  @IsOptional()
  @IsString()
  redirect_uri?: string;
}
