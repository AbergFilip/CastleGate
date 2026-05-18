import { IsOptional, IsString } from 'class-validator';

export class IssueTokenDto {
  @IsString()
  @IsOptional()
  deviceName?: string;
}
