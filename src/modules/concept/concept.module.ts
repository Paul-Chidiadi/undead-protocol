import { Module } from '@nestjs/common';
import { Conception, ConceptionSchema } from './entities/concept.entity';
import { Counter, CounterSchema } from './entities/counter.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConceptController } from './concept.controller';
import { ConceptRepository } from './concept.repository';
import { ConceptService } from './concept.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conception.name, schema: ConceptionSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [ConceptController],
  providers: [ConceptService, ConceptRepository],
  exports: [ConceptService, ConceptRepository],
})
export class ConceptModule {}
