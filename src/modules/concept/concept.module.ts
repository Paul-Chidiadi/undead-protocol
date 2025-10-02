import { Module } from '@nestjs/common';
import { ConceptService } from './concept.service';
import { ConceptController } from './concept.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Concept,
  ConceptSchema,
  Counter,
  CounterSchema,
} from './entities/concept.entity';
import { ConceptRepository } from './concept.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Concept.name, schema: ConceptSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [ConceptController],
  providers: [ConceptService, ConceptRepository],
  exports: [ConceptService, ConceptRepository],
})
export class ConceptModule {}
