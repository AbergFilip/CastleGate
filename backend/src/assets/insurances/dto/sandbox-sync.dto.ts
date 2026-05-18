import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SandboxSyncDto {
  @ApiProperty({ description: 'Insurance company ID for sandbox sync' })
  @IsString()
  @IsNotEmpty()
  company_id!: string;
}
