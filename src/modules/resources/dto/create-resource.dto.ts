import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({
    description: 'admin authenticated password',
  })
  @IsString()
  @IsNotEmpty()
  authPass: string;

  @ApiProperty({
    description: 'Name of the resource',
    example: 'Gold',
  })
  @IsString()
  @IsNotEmpty()
  resourceName: string;

  @ApiProperty({
    description: 'Number of decimal places the resource can be divided into',
    example: 6,
  })
  @IsNumber()
  @IsNotEmpty()
  resourceDecimal: number;

  @ApiProperty({
    description: 'Symbol of the resource',
    example: 'GOLD',
  })
  @IsString()
  @IsNotEmpty()
  resourceSymbol: string;

  @ApiProperty({
    description: 'URI of the resource',
    example: 'https://example.com',
  })
  @IsString()
  @IsNotEmpty()
  uri: string;

  @ApiProperty({
    description:
      'Optional, tags for the resource; tags act as metadata to help you keep track of game stats',
    example: ['Sword'],
  })
  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @ApiProperty({
    description: 'Address of the project',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  projectAddress: string;
}

export class CreateResourceTreeDto {
  @ApiProperty({
    description: 'admin authenticated password',
  })
  @IsString()
  @IsNotEmpty()
  authPass: string;

  @ApiProperty({
    description: 'Address of the resource',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  resourceAddress: string;

  @ApiProperty({
    description: 'Address of the project',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  projectAddress: string;
}

export class MintResourceDto {
  @ApiProperty({
    description: 'Amount of resource to mint',
    example: '1000',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: 'Wallet Address of the user',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}

export class CreateBadgeDto {
  @ApiProperty({
    description: 'admin authenticated password',
  })
  @IsString()
  @IsNotEmpty()
  authPass: string;

  @ApiProperty({
    description: 'Address of the project',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  projectAddress: string;
}

export class CreateProjectDto {
  @ApiProperty({
    description: 'admin authenticated password',
  })
  @IsString()
  @IsNotEmpty()
  authPass: string;
}

export class CreateProfileTreeDto {
  @ApiProperty({
    description: 'admin authenticated password',
  })
  @IsString()
  @IsNotEmpty()
  authPass: string;
}

export class CreateProfileDto {
  @ApiProperty({
    description: 'wallet address of the user',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'access token of the user',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'wallet address of the user',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'name of user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OnboardUserDto {
  @ApiProperty({
    description: 'wallet address of the user',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'access token of the user',
    example: 'Ech68sbvs88sndv9s8vnbsvns0HLqrstUvw',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'name of user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
