import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { dbTimeStamp } from 'src/common/utils/utils.service';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class Organization extends TimeStampWithDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  walletAddress: string;

  @Prop({ required: true })
  organizationName: string;

  @Prop()
  telegramId: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export type OrganizationDocument = HydratedDocument<Organization>;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Add a compound unique index
OrganizationSchema.index(
  { email: 1, organizationName: 1, walletAddress: 1 },
  { unique: true },
);
