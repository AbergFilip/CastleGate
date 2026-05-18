import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SandboxCallbackDto {
  @ApiProperty({ description: 'Sandbox session ID' })
  @IsString()
  @IsNotEmpty()
  session_id!: string;
}
