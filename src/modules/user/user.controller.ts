import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUndeadUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { CreateSuccessResponse } from 'src/common/utils/response.utils';
import { UpdateUndeadUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new undead user profile' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({
    description: 'Unable to Create Undead User profile',
  })
  async createUndeadUser(
    @Body() body: CreateUndeadUserDto,
    @Res() response: Response,
  ) {
    const undeadUser = await this.userService.createUndeadUser(body);
    if (undeadUser) {
      return CreateSuccessResponse(response, undeadUser, 'Successful');
    }
    throw new HttpException(
      'Unable to  Undead User profile. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Undead User by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({
    description: 'Unable to Update undead user profile',
  })
  async updateUndeadUser(
    @Body() body: UpdateUndeadUserDto,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const updatedUndeadUser = await this.userService.updateUndeadUser(id, body);
    if (updatedUndeadUser) {
      return CreateSuccessResponse(response, updatedUndeadUser, 'Successful');
    }
    throw new HttpException(
      'Unable to Update undead user profile. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Undead User' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Get Undead User' })
  async getUser(@Param('id') id: string, @Res() response: Response) {
    const user = await this.userService.getUser(id);
    if (user) {
      return CreateSuccessResponse(response, user, 'Successful');
    }
    throw new HttpException(
      'Unable to Get Undead User. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('')
  @ApiOperation({ summary: 'Fetch All Undead User' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Fetch Undead Users' })
  async fetchUsers(@Res() response: Response) {
    const users = await this.userService.fetchUsers();
    if (users) {
      return CreateSuccessResponse(response, users, 'Successful');
    }
    throw new HttpException(
      'Unable to Fetch Undead Users. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
