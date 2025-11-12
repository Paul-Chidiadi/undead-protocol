import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourcesModule } from './modules/resources/resources.module';
import { ConceptModule } from './modules/concept/concept.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { AuthenticationMiddleware } from './common/middlewares/authentication.middleware';

@Module({
  imports: [
    DatabaseModule,
    ResourcesModule,
    ConceptModule,
    UserModule,
    OrganizationsModule,
    NotificationsModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('resources', 'resources/(.*)')
      .forRoutes('*');
  }
}
