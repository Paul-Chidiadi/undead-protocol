import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/database/base.repository';
import { Organization } from './entities/organizations.entity';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(
    @InjectModel(Organization.name)
    protected readonly organizationModel: Model<Organization>,
  ) {
    super(organizationModel);
  }
}
