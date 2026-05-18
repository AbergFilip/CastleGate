import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'Recipient user ID' })
  @IsUUID()
  @IsNotEmpty()
  recipientId!: string;

  @ApiProperty({ description: 'Message subject' })
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ description: 'Message category', enum: ['person', 'company', 'announcement'], required: false })
  @IsEnum(['person', 'company', 'announcement'])
  @IsOptional()
  category?: string;
}

