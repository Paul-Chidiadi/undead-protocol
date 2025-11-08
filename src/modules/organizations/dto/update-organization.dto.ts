import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({
    description: 'Unique email address of the organization',
    example: 'contact@mycompany.com',
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Wallet address of the organization',
    example: '0x1234abcd5678ef901234abcd5678ef90abcd1234',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'Registered name of the organization',
    example: 'MyCompany Inc.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({
    description: 'Telegram user or group ID for communication',
    example: '@mycompany_support',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({
    description: 'Verification status of the organization',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
