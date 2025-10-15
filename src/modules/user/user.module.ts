import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UndeadUser, UndeadUserSchema } from './entities/user.entity';
import { UndeadUserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UndeadUser.name, schema: UndeadUserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UndeadUserRepository],
  exports: [UserService, UndeadUserRepository],
})
export class UserModule {}
