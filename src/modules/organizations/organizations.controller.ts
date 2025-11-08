import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateSuccessResponse } from 'src/common/utils/response.utils';
import {
  ApiBadRequestResponse,
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

  @Post('')
  @ApiOperation({ summary: 'Create a new Organization' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Organization' })
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
}
