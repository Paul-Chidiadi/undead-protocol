import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/database/base.repository';
import { UndeadUser } from './entities/user.entity';

@Injectable()
export class UndeadUserRepository extends BaseRepository<UndeadUser> {
  constructor(
    @InjectModel(UndeadUser.name)
    private readonly undeadUserModel: Model<UndeadUser>,
  ) {
    super(undeadUserModel);
  }
}
