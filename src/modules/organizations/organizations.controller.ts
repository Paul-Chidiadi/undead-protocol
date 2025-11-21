import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateSuccessResponse } from 'src/common/utils/response.utils';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
@ApiTags('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('/all')
  @ApiOperation({ summary: 'Fetch all Organizations' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Fetch Organizations' })
  @ApiBearerAuth()
  async fetchOrganizations(@Res() response: Response) {
    const organizations = await this.organizationsService.find({});
    if (organizations) {
      return CreateSuccessResponse(response, organizations, 'Successful');
    }
    throw new HttpException(
      'Unable to Fetch Organizations. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Organization' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Fetch Single Organization' })
  @ApiBearerAuth()
  async getOrganization(@Param('id') id: string, @Res() response: Response) {
    const organization = await this.organizationsService.findOne({ _id: id });
    if (organization) {
      return CreateSuccessResponse(response, organization, 'Successful');
    }
    throw new HttpException(
      'Unable to Fetch Single Organizations. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Single Organization' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({
    description: 'Unable to Delete Single Organization',
  })
  @ApiBearerAuth()
  async deleteOrganization(@Param('id') id: string, @Res() response: Response) {
    const organization = await this.organizationsService.deleteOne({ _id: id });
    if (organization) {
      return CreateSuccessResponse(response, organization, 'Successful');
    }
    throw new HttpException(
      'Unable to Delete Single Organizations. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Fetch Single Organization by Email' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Fetch Single Organization' })
  @ApiBearerAuth()
  async getOrganizationByEmail(
    @Param('email') email: string,
    @Res() response: Response,
  ) {
    const organization = await this.organizationsService.findOne({ email });
    if (organization) {
      return CreateSuccessResponse(response, organization, 'Successful');
    }
    throw new HttpException(
      'Unable to Fetch Single Organizations. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new Organization' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Organization' })
  @ApiBearerAuth()
  async createOrganization(
    @Body() body: CreateOrganizationDto,
    @Res() response: Response,
  ) {
    const organizations = await this.organizationsService.create(body);
    if (organizations) {
      return CreateSuccessResponse(response, organizations, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Organization. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an Organization by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Update Organization' })
  @ApiBearerAuth()
  async updateOrganization(
    @Body() body: UpdateOrganizationDto,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const updatedOrganization = await this.organizationsService.update(
      { _id: id },
      body,
    );
    if (updatedOrganization) {
      return CreateSuccessResponse(response, updatedOrganization, 'Successful');
    }
    throw new HttpException(
      'Unable to Update Organization. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('leaderboard/:organizationId')
  @ApiOperation({ summary: 'Get Organization leaderboard' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({
    description: 'Unable to Get Organization leaderboard',
  })
  @ApiBearerAuth()
  async getOrganizationLeaderboard(
    @Param('organizationId') organizationId: string,
    @Query('limit') limit?: number,
    @Query('minBattles') minBattles?: number,
  ) {
    return this.organizationsService.getOrganizationLeaderboard({
      organizationId,
      limit: limit ? parseInt(limit.toString()) : 10,
      minBattles: minBattles ? parseInt(minBattles.toString()) : 1,
    });
  }

  @Get('leaderboard/:organizationId/player/:playerName')
  @ApiOperation({ summary: 'Get Organizations player stats' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({
    description: 'Unable to Get Organizations player stats',
  })
  @ApiBearerAuth()
  async getPlayerStats(
    @Param('organizationId') organizationId: string,
    @Param('playerName') playerName: string,
  ) {
    return this.organizationsService.getPlayerStats(organizationId, playerName);
  }

  @Get('leaderboard/:organizationId/top/:category')
  @ApiOperation({ summary: 'Get Organizations top performers' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({
    description: 'Unable to Get Organizations top performers',
  })
  @ApiBearerAuth()
  async getTopPerformers(
    @Param('organizationId') organizationId: string,
    @Param('category') category: 'accuracy' | 'wins' | 'battles',
    @Query('limit') limit?: number,
  ) {
    return this.organizationsService.getTopPerformers(
      organizationId,
      category,
      limit ? parseInt(limit.toString()) : 10,
    );
  }
}
