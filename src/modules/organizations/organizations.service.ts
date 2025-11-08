import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './organizations.repository';
import { Organization } from './entities/organizations.entity';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { FindType } from 'src/database/base.repository';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  // Create a new Organization record
  async create(data: Partial<Organization>) {
    try {
      const createdOrganization =
        await this.organizationRepository.create(data);
      return createdOrganization;
    } catch (error) {
      if (error.code == 11000)
        throw new BadRequestException('Organization data already exist');
      throw new BadRequestException('Error occur while creating Organization');
    }
  }

  // Fetch a single Organization record
  async findOne(
    data: FilterQuery<Organization>,
    options: FindType<Organization> = {},
  ) {
    const result = await this.organizationRepository.findOne(
      {
        ...data,
      },
      { ...options },
    );
    if (!result) {
      throw new NotFoundException('Organization not found');
    }
    return result;
  }

  async find(
    data: FilterQuery<Organization>,
    options: FindType<Organization> = {},
  ) {
    return await this.organizationRepository.find(
      {
        ...data,
      },
      { ...options },
    );
  }

  async update(
    filterData: FilterQuery<Organization>,
    update: UpdateQuery<Organization> = {},
  ) {
    const existingOrganization = await this.organizationRepository.update(
      { ...filterData },
      { $set: { ...update } },
    );
    if (!existingOrganization) {
      throw new NotFoundException('Organization not found');
    }
    return existingOrganization;
  }
}
