import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envConfig } from './common/config/env.config';
import * as cookieParser from 'cookie-parser';
import * as hpp from 'hpp';
import helmet from 'helmet';
import * as compression from 'compression';
import { GlobalExceptionFilter } from './common/exceptions/global.exception';
import { WinstonModule } from 'nest-winston';
import instance from '../winston.config';
import { ValidatorErrorHandler } from './common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';
import cron from 'node-cron';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  // set port
  const PORT = envConfig.PORT || 5000;

  // allow cookie
  app.use(cookieParser());

  // Prevent parameter pollution
  app.use(hpp());

  // Set security HTTP headers
  app.use([compression(), helmet()]);

  // Enable CORS
  app.enableCors({
    origin: [`${envConfig.LOCAL_URL}`, `${envConfig.CLIENT_URL}`],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(new ValidationPipe(ValidatorErrorHandler));

  const config = new DocumentBuilder()
    .setTitle('RUST-UNDEAD PROTOCOL API')
    .setDescription('RUST-UNDEAD PROTOCOL API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Schedule cron job to run every 13 minutes
  cron.schedule('*/13 * * * *', async () => {
    try {
      const url =
        process.env.NODE_ENV === 'developement'
          ? `localhost:5000`
          : `https://undead-protocol-uam2.onrender.com`;
      const response = await axios.get(url);
      console.log(
        `[${new Date().toISOString()}] Pinged self:`,
        response.status,
      );
    } catch (error: any) {
      console.error('Error pinging self:', error.message);
    }
  });

  // Enable trust proxy header
  app.use(
    (req: { headers: { [x: string]: string } }, res: any, next: () => void) => {
      req.headers['x-forwarded-proto'] = 'https';
      next();
    },
  );

  await app.listen(PORT);
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
bootstrap();
