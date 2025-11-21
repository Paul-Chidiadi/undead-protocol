import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomRepository } from './rooms.repository';
import { Room } from './entities/rooms.entity';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { FindType } from 'src/database/base.repository';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomRepository) {}

  // Create a new Room record
  async create(data: Partial<Room>) {
    try {
      const createdRoom = await this.roomsRepository.create(data);
      return createdRoom;
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('Room data already exist');
      throw new BadRequestException('Error occur while creating Room');
    }
  }

  // Fetch a single Room record
  async findOne(data: FilterQuery<Room>, options: FindType<Room> = {}) {
    const result = await this.roomsRepository.findOne(
      {
        ...data,
      },
      { ...options },
    );
    return result;
  }

  async find(data: FilterQuery<Room>, options: FindType<Room> = {}) {
    return await this.roomsRepository.find(
      {
        ...data,
      },
      { ...options },
    );
  }

  async deleteOne(data: FilterQuery<Room>, options: FindType<Room> = {}) {
    return await this.roomsRepository.deleteOne({
      ...data,
    });
  }

  async update(filterData: FilterQuery<Room>, update: UpdateQuery<Room> = {}) {
    const existingRoom = await this.roomsRepository.update(
      { ...filterData },
      { $set: { ...update } },
    );
    if (!existingRoom) {
      throw new NotFoundException('Room not found');
    }
    return existingRoom;
  }
}
