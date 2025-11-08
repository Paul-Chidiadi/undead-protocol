import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConceptRepository } from './concept.repository';
import { ConceptDto } from './dto/concept.dto';
import { IConcept, IQuestion, ITopic } from './interface/concept.interface';
import {
  Conception,
  ConceptionDocument,
  getNextSequence,
} from './entities/concept.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, AnyBulkWriteOperation } from 'mongoose';
import { Counter, CounterDocument } from './entities/counter.entity';

@Injectable()
export class ConceptService {
  constructor(
    private readonly conceptsRepository: ConceptRepository,
    @InjectModel(Conception.name)
    private readonly conceptModel: Model<ConceptionDocument>,

    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,
  ) {}

  async getConcepts(organizationId: String): Promise<IConcept[]> {
    return this.conceptsRepository.find({ organization: organizationId }, {});
  }

  async getOneConcept(id: string): Promise<IConcept> {
    const concept = await this.conceptsRepository.findById(id);
    if (!concept) throw new NotFoundException('Concept not found');
    return concept;
  }

  async getOneOrMultipleConcept(ids: number[], organization: string) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Please provide at least one concept ID');
    }
    return this.conceptsRepository.findOneOrMultipleConceptByIds(
      ids,
      organization,
    );
  }

  async getOneOrMultipleTopics(ids: number[], organization: string) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Please provide at least one topic ID');
    }
    return this.conceptsRepository.findOneOrMultipleTopicByIds(
      ids,
      organization,
    );
  }

  async getOneOrMultipleQuestions(ids: number[], organization: string) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Please provide at least one question ID');
    }
    return this.conceptsRepository.findOnlyMatchingQuestions(ids, organization);
  }

  async createConcept(data: ConceptDto): Promise<IConcept> {
    const payload: Partial<Conception> = {
      organization: data.organization,
      concept_id: data.concept_id,
      title: data.title,
      description: data.description,
      topics: data.topics,
    };

    // Move sequence generation here
    payload.concept_id = await getNextSequence('concept_id', this.counterModel);
    for (const topic of payload.topics || []) {
      topic.topic_id = await getNextSequence('topic_id', this.counterModel);

      for (const question of topic.questions || []) {
        question.question_id = await getNextSequence(
          'question_id',
          this.counterModel,
        );
      }
    }

    const concept = await this.conceptsRepository.create(payload);
    if (!concept) {
      throw new InternalServerErrorException('Unable to create concept');
    }
    return concept;
  }

  async updateConcept(id: string, data: ConceptDto, organization: string) {
    const concept = await this.conceptsRepository.update(
      { concept_id: id, organization: organization },
      data,
    );
    if (!concept)
      throw new NotFoundException('Concept not found for this organization');
    return concept;
  }

  async deleteConcept(id: string, organization: string): Promise<boolean> {
    const deleted = await this.conceptsRepository.deleteOne({
      concept_id: id,
      organization: organization,
    });
    if (!deleted)
      throw new InternalServerErrorException('Unable to delete concept');
    return deleted;
  }

  async repairGlobalIds(): Promise<{
    message: string;
    concepts: number;
    topics: number;
    questions: number;
  }> {
    console.log('Starting global ID repair...');

    // Read all concepts deterministically (sort by _id)
    const concepts = await this.conceptModel.find().sort({ _id: 1 }).lean();

    let conceptCounter = 1;
    let topicCounter = 1;
    let questionCounter = 1;

    const bulkOps: AnyBulkWriteOperation<ConceptionDocument>[] = [];

    for (const c of concepts) {
      const topics = Array.isArray(c.topics) ? c.topics : [];

      for (let ti = 0; ti < topics.length; ti++) {
        topics[ti].topic_id = topicCounter++;

        const questions = Array.isArray(topics[ti].questions)
          ? topics[ti].questions
          : [];

        for (let qi = 0; qi < questions.length; qi++) {
          questions[qi].question_id = questionCounter++;
        }
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: c._id },
          update: {
            $set: {
              concept_id: conceptCounter++,
              topics: topics,
            },
          },
        },
      });

      // flush in batches to reduce memory usage
      if (bulkOps.length >= 200) {
        await this.conceptModel.bulkWrite(bulkOps);
        bulkOps.length = 0;
      }
    }

    if (bulkOps.length > 0) {
      await this.conceptModel.bulkWrite(bulkOps);
    }

    const lastConcept = conceptCounter - 1;
    const lastTopic = topicCounter - 1;
    const lastQuestion = questionCounter - 1;

    // Update counters for future insertions
    await this.counterModel.findByIdAndUpdate(
      'concept_id',
      { $set: { sequence_value: lastConcept } },
      { upsert: true },
    );

    await this.counterModel.findByIdAndUpdate(
      'topic_id',
      { $set: { sequence_value: lastTopic } },
      { upsert: true },
    );

    await this.counterModel.findByIdAndUpdate(
      'question_id',
      { $set: { sequence_value: lastQuestion } },
      { upsert: true },
    );

    console.log(
      `Repair complete. concepts=${lastConcept}, topics=${lastTopic}, questions=${lastQuestion}`,
    );

    try {
      await this.conceptModel.collection.createIndex(
        { concept_id: 1 },
        { unique: true, background: true },
      );
      await this.conceptModel.collection.createIndex(
        { 'topics.topic_id': 1 },
        { unique: true, background: true },
      );
      await this.conceptModel.collection.createIndex(
        { 'topics.questions.question_id': 1 },
        { unique: true, background: true },
      );
    } catch (err) {
      console.error(`Index creation failed: ${err.message}`);
    }

    return {
      message: `Repair complete. concepts=${lastConcept}, topics=${lastTopic}, questions=${lastQuestion}`,
      concepts: lastConcept,
      topics: lastTopic,
      questions: lastQuestion,
    };
  }
}
