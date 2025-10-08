import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Model } from 'mongoose';
import { dbTimeStamp } from 'src/common/utils/utils.service';
import { CounterDocument } from './counter.entity';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';

// subSchema for LearningContent
export class LearningContent {
  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  big_note: string[];

  @Prop({ required: true })
  battle_relevance: string;
}

// subSchema for Question
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
export class Concept extends TimeStampWithDocument {
  @Prop({ required: true, unique: true })
  concept_id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Topic] })
  topics: Topic[];
}
export type ConceptDocument = HydratedDocument<Concept>;
export const ConceptSchema = SchemaFactory.createForClass(Concept);

export async function getNextSequence(
  name: string,
  counterModel: Model<CounterDocument>,
): Promise<number> {
  const counter = await counterModel.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return counter.seq;
}

// ConceptSchema.pre<ConceptDocument>('save', async function (next) {
//   if (this.isNew) {
//     this.concept_id = await getNextSequence('concept_id', CounterModel);

//     for (const topic of this.topics) {
//       topic.topic_id = await getNextSequence('topic_id', CounterModel);

//       for (const question of topic.questions) {
//         question.question_id = await getNextSequence(
//           'question_id',
//           CounterModel,
//         );
//       }
//     }
//   }
//   next();
// });
