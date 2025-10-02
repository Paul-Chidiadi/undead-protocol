import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { Model } from 'mongoose';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';
import { dbTimeStamp } from 'src/common/utils/utils.service';

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
export type CounterDocument = Counter & Document;
export const CounterSchema = SchemaFactory.createForClass(Counter);

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class Question extends TimeStampWithDocument {
  @Prop({ required: true, unique: true })
  question_id: number;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  correct: boolean;

  @Prop({ required: true })
  explanation: string;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class LearningContent extends TimeStampWithDocument {
  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], required: true })
  big_note: string[];

  @Prop({ required: true })
  battle_relevance: string;
}
export const LearningContentSchema =
  SchemaFactory.createForClass(LearningContent);

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class Topic extends TimeStampWithDocument {
  @Prop({ required: true, unique: true })
  topic_id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ type: LearningContentSchema, required: true })
  learning_content: LearningContent;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}
export const TopicSchema = SchemaFactory.createForClass(Topic);

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

  @Prop({ type: [TopicSchema], default: [] })
  topics: Topic[];
}
export type ConceptDocument = Concept & Document;
export const ConceptSchema = SchemaFactory.createForClass(Concept);

async function getNextSequence(
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

ConceptSchema.pre<ConceptDocument>('save', async function (next) {
  if (this.isNew) {
    const counterModel = this.db.model<CounterDocument>(
      'Counter',
      CounterSchema,
    );

    this.concept_id = await getNextSequence('concept_id', counterModel);

    for (const topic of this.topics) {
      topic.topic_id = await getNextSequence('topic_id', counterModel);

      for (const question of topic.questions) {
        question.question_id = await getNextSequence(
          'question_id',
          counterModel,
        );
      }
    }
  }
  next();
});
