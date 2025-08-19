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
  CreateProfileDto,
  CreateProfileTreeDto,
  CreateProjectDto,
  CreateResourceDto,
  CreateResourceTreeDto,
  CreateUserDto,
  MintResourceDto,
  OnboardUserDto,
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

  @Post('mint')
  @ApiOperation({ summary: 'Mint token Resource to players' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Mint Resource' })
  async mintResource(@Body() body: MintResourceDto, @Res() response: Response) {
    const resource = await this.resourcesService.mintResource(body);
    if (resource) {
      return CreateSuccessResponse(response, resource, 'Successful');
    }
    throw new HttpException(
      'Unable to Mint Token Resource to user. Please try again later!',
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

  @Post('profile-tree')
  @ApiOperation({ summary: 'Create Profile Tree' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Profile Tree' })
  async createProfileTree(
    @Body() body: CreateProfileTreeDto,
    @Res() response: Response,
  ) {
    const profileTree = await this.resourcesService.createProfileTree(body);
    if (profileTree) {
      return CreateSuccessResponse(response, profileTree, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Profile Tree. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('user')
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create User' })
  async createUser(@Body() body: CreateUserDto, @Res() response: Response) {
    const user = await this.resourcesService.createUser(body);
    if (user) {
      return CreateSuccessResponse(response, user, 'Successful');
    }
    throw new HttpException(
      'Unable to Create User. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('profile')
  @ApiOperation({ summary: 'Create Profile' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Profile' })
  async createProfile(
    @Body() body: CreateProfileDto,
    @Res() response: Response,
  ) {
    const user = await this.resourcesService.createProfile(body);
    if (user) {
      return CreateSuccessResponse(response, user, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Profile. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('onboard')
  @ApiOperation({ summary: 'Onboard User' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Onboard User' })
  async onboardUser(@Body() body: OnboardUserDto, @Res() response: Response) {
    const user = await this.resourcesService.onboardUser(body);
    if (user) {
      return CreateSuccessResponse(response, user, 'Successful');
    }
    throw new HttpException(
      'Unable to Onboard User. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
