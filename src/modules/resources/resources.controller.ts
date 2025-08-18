import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import {
  CreateBadgeDto,
  CreateProjectDto,
  CreateResourceDto,
  CreateResourceTreeDto,
} from './dto/create-resource.dto';
import { CreateSuccessResponse } from 'src/common/utils/response.utils';
import { Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('resources')
@ApiTags('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('')
  @ApiOperation({ summary: 'Create Resource' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Resource' })
  async createResource(
    @Body() body: CreateResourceDto,
    @Res() response: Response,
  ) {
    const resource = await this.resourcesService.createResource(body);
    if (resource) {
      return CreateSuccessResponse(response, resource, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Resource. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('tree')
  @ApiOperation({ summary: 'Create Resource Tree' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Resource Tree' })
  async createResourceTree(
    @Body() body: CreateResourceTreeDto,
    @Res() response: Response,
  ) {
    const resourceTree = await this.resourcesService.createResourceTree(body);
    if (resourceTree) {
      return CreateSuccessResponse(response, resourceTree, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Resource Tree. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('badge')
  @ApiOperation({ summary: 'Create Badge' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Badge' })
  async createBadge(@Body() body: CreateBadgeDto, @Res() response: Response) {
    const badge = await this.resourcesService.createBadge(body);
    if (badge) {
      return CreateSuccessResponse(response, badge, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Badge. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('project')
  @ApiOperation({ summary: 'Create Project' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Project' })
  async createProject(
    @Body() body: CreateProjectDto,
    @Res() response: Response,
  ) {
    const badge = await this.resourcesService.createProject(body);
    if (badge) {
      return CreateSuccessResponse(response, badge, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Project. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('user')
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create User' })
  async createUser(@Body() body: CreateProjectDto, @Res() response: Response) {
    const user = await this.resourcesService.createUser(body);
    if (user) {
      return CreateSuccessResponse(response, user, 'Successful');
    }
    throw new HttpException(
      'Unable to Create User. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
