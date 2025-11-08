import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/database/base.repository';
import { Room } from './entities/rooms.entity';

@Injectable()
export class RoomRepository extends BaseRepository<Room> {
  constructor(
    @InjectModel(Room.name)
    protected readonly roomModel: Model<Room>,
  ) {
    super(roomModel);
  }
}
