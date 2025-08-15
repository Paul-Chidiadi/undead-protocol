import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs/promises';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class GlobalExceptionFilter
  extends BaseWsExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger('ErrorHandler');

  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    if (host.getType() == 'ws' && exception instanceof WsException) {
      const ctx = host.switchToWs().getClient() as WebSocket;
      this.logger.log(JSON.stringify(exception));
      ctx.send(JSON.stringify({ event: 'error', data: exception.message }));
    }
    if (host.getType() === 'http' && exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
      const message = exception.message;
      if (request.files?.length) {
        const files = request.files as unknown as Express.Multer.File[];

        files.map(async (document) => {
          await fs.unlink(document.path);
        });
      }
      this.logger.log(JSON.stringify(exception));

      response.status(status).json({
        statusCode: status,
        message,
        exception:
          process.env.NODE_ENV === 'staging' ? JSON.stringify(exception) : '',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
