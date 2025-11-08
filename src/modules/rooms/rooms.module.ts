import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomRepository } from './rooms.repository';
import { Room, RoomSchema } from './entities/rooms.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
  exports: [RoomsService, RoomRepository],
})
export class RoomsModule {}
