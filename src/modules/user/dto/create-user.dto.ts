import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserProgress {
  @ApiProperty({ description: 'The current chapter number', example: 3 })
  @IsNumber()
  chapter: number;

  @ApiProperty({ description: 'The current path number', example: 1 })
  @IsNumber()
  path: number;
}

export class CreateUndeadUserDto {
  @ApiProperty({
    description: 'The wallet address of the user',
    example: '0x4b20993Bc481177ec7E8f571ceCaE8A9e22C02db',
  })
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'The chosen display name of the user',
    example: 'CryptoWarrior',
  })
  @IsNotEmpty()
  @IsString()
  profileName: string;

  @ApiProperty({
    description: 'The guide the user has chosen to follow',
    example: 'The Undead Path',
  })
  @IsNotEmpty()
  @IsString()
  choosenGuide: string;

  @ApiProperty({
    description: 'URL or path to the user’s avatar image',
    example: 'https://example.com/avatars/user1.png',
  })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({
    description: 'The progress of the user in the game or course',
    type: () => UserProgress,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => UserProgress)
  userProgress: UserProgress;
}
