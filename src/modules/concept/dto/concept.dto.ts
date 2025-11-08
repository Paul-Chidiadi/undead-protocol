import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Min,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsMongoId,
} from 'class-validator';

export class QuestionDto {
  @ApiProperty({ example: 1, description: 'Unique ID of the question' })
  @IsInt()
  @Min(1)
  question_id: number;

  @ApiProperty({ example: 'What is a bit?', description: 'The question text' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: true, description: 'Whether the answer is correct' })
  @IsBoolean()
  correct: boolean;

  @ApiProperty({
    example: 'A bit is the smallest unit of data in computing.',
    description: 'Explanation of the answer',
  })
  @IsString()
  @IsNotEmpty()
  explanation: string;
}

export class LearningContentDto {
  @ApiProperty({ example: 'Intro to binary representation' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    type: [String],
    example: ['Bits and bytes', 'Binary arithmetic'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  big_note: string[];

  @ApiProperty({ example: 'Essential for understanding computers' })
  @IsString()
  @IsNotEmpty()
  battle_relevance: string;
}

export class TopicDto {
  @ApiProperty({ example: 101 })
  @IsInt()
  @Min(1)
  topic_id: number;

  @ApiProperty({ example: 'Binary Numbers' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: () => LearningContentDto })
  @ValidateNested()
  @Type(() => LearningContentDto)
  learning_content: LearningContentDto;

  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class ConceptDto {
  @ApiProperty({ example: '67af312dbbc41234567890aa' })
  @IsString()
  @IsMongoId()
  organization: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  concept_id: number;

  @ApiProperty({ example: 'Computer Systems Fundamentals' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'How computers actually work' })
  @IsString()
  description: string;

  @ApiProperty({ type: [TopicDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicDto)
  topics: TopicDto[];
}

export class GetMultipleConceptsDto {
  @ApiProperty({
    description: 'List of concept IDs to fetch',
    type: [Number],
    example: [4, 5],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Type(() => Number)
  ids: number[];
}
