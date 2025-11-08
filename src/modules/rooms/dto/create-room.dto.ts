import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { BattleState } from '../entities/rooms.entity';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Unique room identifier',
    example: 'room-12345',
  })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({
    description: 'Public key of Player A',
    example: '4f3sdg34g34dfgdfgdfgdfg34g3dfg3df',
  })
  @IsString()
  @IsNotEmpty()
  playerA: string;

  @ApiProperty({
    description: 'Public key of Player B (optional)',
    example: '7d8fg67dfgdfgdfgdfgdfgdfg345345',
    required: false,
  })
  @IsOptional()
  @IsString()
  playerB?: string | null;

  @ApiProperty({
    description: 'Warrior selected by Player A',
    example: 'warrior-01',
  })
  @IsString()
  @IsNotEmpty()
  warriorA: string;

  @ApiProperty({
    description: 'Warrior selected by Player B (optional)',
    example: 'warrior-02',
    required: false,
  })
  @IsOptional()
  @IsString()
  warriorB?: string | null;

  @ApiProperty({
    description: 'Current battle state',
    enum: BattleState,
    default: BattleState.Created,
  })
  @IsEnum(BattleState)
  @IsOptional()
  state?: BattleState;

  @ApiProperty({
    description: 'Player A answers (10 boolean-or-null values)',
    example: [null, true, false, null, null, true, false, null, null, null],
  })
  @IsOptional()
  @IsArray()
  playerAAnswers?: (boolean | null)[];

  @ApiProperty({
    description: 'Player B answers (10 boolean-or-null values)',
    example: [null, null, false, true, null, null, false, null, true, null],
  })
  @IsOptional()
  @IsArray()
  playerBAnswers?: (boolean | null)[];

  @ApiProperty({
    description: 'Correct answers count for Player A',
    example: 3,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  playerACorrect?: number;

  @ApiProperty({
    description: 'Correct answers count for Player B',
    example: 5,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  playerBCorrect?: number;

  @ApiProperty({
    description: 'Public key of the winner (optional)',
    example: '5tgr34g34g34dfgdfgdfgdfgd34g34',
    required: false,
  })
  @IsOptional()
  @IsString()
  winner?: string | null;

  @ApiProperty({
    description: 'Battle duration in seconds',
    example: 300,
  })
  @IsNumber()
  @IsNotEmpty()
  battleDuration: number;

  @ApiProperty({
    description: 'Organization ID that owns this room',
    example: '67ab23cd45ef123456789012',
  })
  @IsNotEmpty()
  @IsMongoId()
  organization: string;
}
