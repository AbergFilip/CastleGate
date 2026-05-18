import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: 'Notification category' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Notification description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Notification type' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Reference ID' })
  @IsUUID()
  @IsOptional()
  referenceId?: string;
}

