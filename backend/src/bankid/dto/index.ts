import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthDto {
  @ApiPropertyOptional({ description: 'Personal number' })
  @IsOptional()
  @IsString()
  personalNumber?: string;

  @ApiPropertyOptional({ description: 'End user IP address' })
  @IsOptional()
  @IsString()
  endUserIp?: string;
}

export class CollectDto {
  @ApiProperty({ description: 'Order reference from BankID auth' })
  @IsString()
  @IsNotEmpty()
  orderRef!: string;
}

export class SignupDto {
  @ApiProperty({ description: 'Personal number' })
  @IsString()
  @IsNotEmpty()
  personalNumber!: string;

  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class SigninDto {
  @ApiProperty({ description: 'Personal number' })
  @IsString()
  @IsNotEmpty()
  personalNumber!: string;

  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class LinkDto {
  @ApiProperty({ description: 'Personal number' })
  @IsString()
  @IsNotEmpty()
  personalNumber!: string;

  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

