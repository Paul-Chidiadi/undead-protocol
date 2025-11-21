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
  Res,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSuccessResponse } from 'src/common/utils/response.utils';
import { Response } from 'express';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('/all/:organizationId')
  @ApiOperation({ summary: 'Fetch all Rooms for an Organization' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Fetch Rooms' })
  @ApiBearerAuth()
  async fetchRooms(
    @Param('organizationId') organizationId: string,
    @Res() response: Response,
  ) {
    const rooms = await this.roomsService.find({
      organization: organizationId,
    });
    if (rooms) {
      return CreateSuccessResponse(response, rooms, 'Successful');
    }
    throw new HttpException(
      'Unable to Fetch Rooms. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Single Room' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Fetch Single Room' })
  @ApiBearerAuth()
  async getRoom(@Param('id') id: string, @Res() response: Response) {
    const room = await this.roomsService.findOne({ roomId: id });
    if (room) {
      return CreateSuccessResponse(response, room, 'Successful');
    }
    throw new HttpException(
      'Unable to Fetch Single Room. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Single Room' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Delete Single Room' })
  @ApiBearerAuth()
  async deleteRoom(@Param('id') id: string, @Res() response: Response) {
    const room = await this.roomsService.deleteOne({ roomId: id });
    if (room) {
      return CreateSuccessResponse(response, room, 'Successful');
    }
    throw new HttpException(
      'Unable to Delete Single Room. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new Room' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Create Room' })
  @ApiBearerAuth()
  async createRoom(@Body() body: CreateRoomDto, @Res() response: Response) {
    const room = await this.roomsService.create(body);
    if (room) {
      return CreateSuccessResponse(response, room, 'Successful');
    }
    throw new HttpException(
      'Unable to Create Room. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an Room by ID' })
  @ApiResponse({ status: 200, description: 'Successful' })
  @ApiBadRequestResponse({ description: 'Unable to Update Room' })
  @ApiBearerAuth()
  async updateRoom(
    @Body() body: UpdateRoomDto,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const updatedRoom = await this.roomsService.update({ roomId: id }, body);
    if (updatedRoom) {
      return CreateSuccessResponse(response, updatedRoom, 'Successful');
    }
    throw new HttpException(
      'Unable to Update Room. Please try again later!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
