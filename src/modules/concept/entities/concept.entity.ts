import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Model } from 'mongoose';
import { dbTimeStamp } from 'src/common/utils/utils.service';
import { CounterDocument, CounterModel } from './counter.entity';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';

// subSchema for LearningContent
@Schema({ _id: false })
export class LearningContent {
  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  big_note: string[];

  @Prop({ required: true })
  battle_relevance: string;
}

// subSchema for Question
@Schema({ _id: false })
export class Question {
  @Prop({ required: true, unique: true })
  question_id: number;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  correct: boolean;

  @Prop({ required: true })
  explanation: string;
}

// subSchema for Topic
@Schema({ _id: false })
export class Topic {
  @Prop({ required: true, unique: true })
  topic_id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ type: LearningContent })
  learning_content: LearningContent;

  @Prop({ type: [Question] })
  questions: Question[];
}

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class Conception extends TimeStampWithDocument {
  @Prop({ required: true, unique: true })
  concept_id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Topic] })
  topics: Topic[];
}

export type ConceptionDocument = HydratedDocument<Conception>;
export const ConceptionSchema = SchemaFactory.createForClass(Conception);

export async function getNextSequence(
  name: string,
  counterModel: Model<CounterDocument>,
): Promise<number> {
  try {
    console.log(`Fetching next sequence for: ${name}`);
    const counter = await counterModel.findByIdAndUpdate(
      name,
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    if (!counter) {
      throw new Error(`Failed to get sequence for ${name}`);
    }

    console.log(`Next sequence for ${name}: ${counter.seq}`);
    return counter.seq;
  } catch (error) {
    console.error(`Error getting next sequence for ${name}:`, error);
    throw error;
  }
}

// Hook is now defined in ConceptionService to avoid loading CounterModel at schema definition time
