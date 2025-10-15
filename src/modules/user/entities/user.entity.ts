import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { dbTimeStamp } from 'src/common/utils/utils.service';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class UndeadUser extends TimeStampWithDocument {
  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop({ required: true })
  profileName: string;

  @Prop({ required: true })
  choosenGuide: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ type: JSON })
  userProgress: {
    chapter: number;
    path: number;
  };
}

export type UndeadUserDocument = HydratedDocument<UndeadUser>;
export const UndeadUserSchema = SchemaFactory.createForClass(UndeadUser);
