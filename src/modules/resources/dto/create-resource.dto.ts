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
}

export class CreateBadgeDto {
  @ApiProperty({
    description: 'admin authenticated password',
  })
  @IsString()
  @IsNotEmpty()
  authPass: string;
}
