import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from 'src/database/base.repository';
import { Conception } from './entities/concept.entity';
import { IConcept, IQuestion, ITopic } from './interface/concept.interface';

@Injectable()
export class ConceptRepository extends BaseRepository<Conception> {
  constructor(
    @InjectModel(Conception.name)
    private readonly conceptModel: Model<Conception>,
  ) {
    super(conceptModel);
  }

  async findOneOrMultipleConceptByIds(ids: number[], organization: string) {
    const concepts = await this.conceptModel.find({
      concept_id: { $in: ids },
      organization,
    });

    // Reorder according to the ids array
    const orderMap = new Map(ids.map((id, i) => [id, i]));
    return concepts.sort(
      (a, b) => orderMap.get(a.concept_id)! - orderMap.get(b.concept_id)!,
    );
  }

  async findOneOrMultipleTopicByIds(ids: number[], organization: string) {
    const result = await this.conceptModel.aggregate([
      { $match: { organization: organization } },
      { $unwind: '$topics' },
      { $match: { 'topics.topic_id': { $in: ids } } },
      { $replaceRoot: { newRoot: '$topics' } },
    ]);

    const orderMap = new Map(ids.map((id, i) => [id, i]));
    return result.sort(
      (a, b) => orderMap.get(a.topic_id)! - orderMap.get(b.topic_id)!,
    );
  }

  async findOnlyMatchingQuestions(ids: number[], organization: string) {
    const result = await this.conceptModel.aggregate([
      { $match: { organization: organization } },
      { $unwind: '$topics' },
      { $unwind: '$topics.questions' },
      { $match: { 'topics.questions.question_id': { $in: ids } } },
      { $project: { _id: 0, question: '$topics.questions' } },
    ]);

    const questions = result.map((r) => r.question);
    const orderMap = new Map(ids.map((id, i) => [id, i]));
    return questions.sort(
      (a, b) => orderMap.get(a.question_id)! - orderMap.get(b.question_id)!,
    );
  }
}
