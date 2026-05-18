import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoCardlessCallbackDto {
  @ApiProperty({ description: 'GoCardless requisition ID' })
  @IsString()
  @IsNotEmpty()
  requisition_id!: string;
}
