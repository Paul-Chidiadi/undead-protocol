import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';
import { dbTimeStamp } from 'src/common/utils/utils.service';

export type CounterDocument = Counter & Document;
@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class Counter extends TimeStampWithDocument {
  @Prop({ required: true })
  declare _id: string; // sequence name (e.g. "concept_id")

  @Prop({ default: 0 })
  seq: number;
}
export const CounterSchema = SchemaFactory.createForClass(Counter);
