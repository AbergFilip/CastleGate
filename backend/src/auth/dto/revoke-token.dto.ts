import { IsOptional, IsString } from 'class-validator';

export class RevokeTokenDto {
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
