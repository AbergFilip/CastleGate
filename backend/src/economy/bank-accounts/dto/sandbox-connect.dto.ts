import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SandboxConnectDto {
  @ApiProperty({ description: 'Sandbox bank ID' })
  @IsString()
  @IsNotEmpty()
  bank_id!: string;
}
