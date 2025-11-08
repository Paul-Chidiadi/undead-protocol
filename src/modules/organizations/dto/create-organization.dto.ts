import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Unique email address of the organization',
    example: 'contact@mycompany.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Wallet address of the organization',
    example: '0x1234abcd5678ef901234abcd5678ef90abcd1234',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'Registered name of the organization',
    example: 'MyCompany Inc.',
  })
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
}
