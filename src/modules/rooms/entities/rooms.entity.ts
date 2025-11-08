import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { dbTimeStamp } from 'src/common/utils/utils.service';
import { TimeStampWithDocument } from 'src/common/utils/timestamp.entity';

export enum BattleState {
  Created = 'created',
  Joined = 'joined',
  QuestionsSelected = 'questionsSelected',
  ReadyForDelegation = 'readyForDelegation',
  InProgress = 'inProgress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

@Schema({
  id: true,
  timestamps: dbTimeStamp,
})
export class Room extends TimeStampWithDocument {
  @Prop({ type: String, required: true, unique: true })
  roomId: string;

  @Prop({ type: String, required: true })
  playerA: string; // PublicKey stored as string

  @Prop({ type: String, default: null })
  playerB: string | null;

  @Prop({ type: String, required: true })
  warriorA: string;

  @Prop({ type: String, default: null })
  warriorB: string | null;

  @Prop({
    default: BattleState.Created,
    enum: Object.values(BattleState),
  })
  state: string;

  @Prop({ type: [Boolean], default: Array(10).fill(null) })
  playerAAnswers: (boolean | null)[];

  @Prop({ type: [Boolean], default: Array(10).fill(null) })
  playerBAnswers: (boolean | null)[];

  @Prop({ type: Number, default: 0 })
  playerACorrect: number;

  @Prop({ type: Number, default: 0 })
  playerBCorrect: number;

  @Prop({ type: String, default: null })
  winner: string | null; // PublicKey string

  @Prop({ type: Number, required: true })
  battleDuration: number;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organization: Types.ObjectId | string;
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
