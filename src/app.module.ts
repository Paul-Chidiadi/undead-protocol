import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourcesModule } from './modules/resources/resources.module';
import { ConceptModule } from './modules/concept/concept.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ResourcesModule, ConceptModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
