import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UndeadUserRepository } from './user.repository';
import { CreateUndeadUserDto } from './dto/create-user.dto';
import { UpdateUndeadUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly undeadUserRepository: UndeadUserRepository) {}

  async createUndeadUser(createUndeadUser: CreateUndeadUserDto) {
    const existingUndeadUser = await this.undeadUserRepository.findOne({
      walletAddress: createUndeadUser.walletAddress,
    });

    if (existingUndeadUser) {
      throw new BadRequestException('Undead User exists already');
    }
    return await this.undeadUserRepository.create(createUndeadUser);
  }

  async updateUndeadUser(id: string, updateUndeadUser: UpdateUndeadUserDto) {
    const existingUndeadUser = await this.undeadUserRepository.findOne({
      _id: id,
    });

    if (!existingUndeadUser) {
      throw new NotFoundException('Undead User not found');
    }
    return await this.undeadUserRepository.update(
      { _id: id },
      { $set: updateUndeadUser },
    );
  }

  async getUser(id: string) {
    const existingUndeadUser = await this.undeadUserRepository.findOne({
      _id: id,
    });

    if (!existingUndeadUser) {
      throw new NotFoundException('Undead User not found');
    }
    return existingUndeadUser;
  }

  async fetchUsers() {
    const existingUndeadUsers = await this.undeadUserRepository.find({});
    return existingUndeadUsers;
  }
}
