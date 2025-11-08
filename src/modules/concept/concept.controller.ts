import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ConceptService } from './concept.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSuccessResponse } from 'src/common/utils/response.utils';
import { Response } from 'express';
import { ConceptDto, GetMultipleConceptsDto } from './dto/concept.dto';

@Controller('concept')
@ApiTags('concept')
export class ConceptController {
  constructor(private readonly conceptService: ConceptService) {}

  @Post('/multiple/:organizationId')
  @ApiOperation({ summary: 'Get one or multiple concepts by IDs' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Get Concepts' })
  async getOneOrMultipleConcept(
    @Body() body: GetMultipleConceptsDto,
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const concept = await this.conceptService.getOneOrMultipleConcept(
      body.ids,
      organizationId,
    );
    if (concept) {
      return CreateSuccessResponse(response, concept, 'Successful');
    }
    throw new HttpException(
      'Unable to Get Concepts. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('/topic/:organizationId')
  @ApiOperation({ summary: 'Get one or multiple topics by IDs' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Get Topics' })
  async getOneOrMultipleTopics(
    @Body() body: GetMultipleConceptsDto,
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const topics = await this.conceptService.getOneOrMultipleTopics(
      body.ids,
      organizationId,
    );
    if (topics) {
      return CreateSuccessResponse(response, topics, 'Successful');
    }
    throw new HttpException(
      'Unable to Get Topics. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('/questions/:organizationId')
  @ApiOperation({ summary: 'Get one or multiple questions by IDs' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Get Questions' })
  async getOneOrMultipleQuestions(
    @Body() body: GetMultipleConceptsDto,
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const questions = await this.conceptService.getOneOrMultipleQuestions(
      body.ids,
      organizationId,
    );
    if (questions) {
      return CreateSuccessResponse(response, questions, 'Successful');
    }
    throw new HttpException(
      'Unable to Get Questions. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('/all/:organizationId')
  @ApiOperation({ summary: 'Fetch all Concepts' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Get Concepts' })
  async getConcepts(
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const concepts = await this.conceptService.getConcepts(organizationId);
    if (concepts) {
      return CreateSuccessResponse(response, concepts, 'Successful');
    }
    throw new HttpException(
      'Unable to Get Concepts. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new concept' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Concept' })
  async createConcept(@Body() body: ConceptDto, @Res() response: Response) {
    const concepts = await this.conceptService.createConcept(body);
    if (concepts) {
      return CreateSuccessResponse(response, concepts, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Concept. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put(':concept_id/:organizationId')
  @ApiOperation({ summary: 'Update a concept by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Update Concept' })
  async updateConcept(
    @Body() body: ConceptDto,
    @Param('concept_id') concept_id: string,
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const updatedConcepts = await this.conceptService.updateConcept(
      concept_id,
      body,
      organizationId,
    );
    if (updatedConcepts) {
      return CreateSuccessResponse(response, updatedConcepts, 'Successful');
    }
    throw new HttpException(
      'Unable to Update Concept. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Delete(':concept_id/:organizationId')
  @ApiOperation({ summary: 'Delete a concept by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Delete Concept' })
  async deleteConcept(
    @Param('concept_id') concept_id: string,
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const deletedConcepts = await this.conceptService.deleteConcept(
      concept_id,
      organizationId,
    );
    if (deletedConcepts) {
      return CreateSuccessResponse(response, deletedConcepts, 'Successful');
    }
    throw new HttpException(
      'Unable to Delete Concept. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('repair')
  @ApiOperation({ summary: 'Repair Global Ids' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to repair ids' })
  async repairGlobalIds(@Res() response: Response) {
    const concept = await this.conceptService.repairGlobalIds();
    if (concept) {
      return CreateSuccessResponse(response, concept, 'Successful');
    }
    throw new HttpException(
      'Unable to repair ids. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
