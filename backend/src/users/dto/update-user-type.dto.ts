import { IsEnum, IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from './user-type.dto';

export class UserTypeMetadataDto {
  @ApiPropertyOptional({ description: 'Organization ID for B2B users' })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Organization name for B2B users' })
  @IsOptional()
  @IsString()
  organizationName?: string;
}

export class UpdateUserTypeDto {
  @ApiProperty({ description: 'User type', enum: UserType })
  @IsEnum(UserType)
  type!: UserType;

  @ApiPropertyOptional({ description: 'Metadata for B2B users' })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserTypeMetadataDto)
  @IsObject()
  metadata?: UserTypeMetadataDto;
}
