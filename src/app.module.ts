import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourcesModule } from './modules/resources/resources.module';
import { ConceptModule } from './modules/concept/concept.module';

@Module({
  imports: [ResourcesModule, ConceptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
