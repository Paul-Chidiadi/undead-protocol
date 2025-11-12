import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { envConfig } from '../config/env.config';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const AUTH_PASSWORD = String(envConfig.AUTH_PASSWORD);

    const authHeader = req.headers.authorization;
    const logger = new Logger('AuthenticationMiddleware');

    // Ensure the Authorization header is present
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Extract the Bearer token from the Authorization header
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      if (String(token) !== AUTH_PASSWORD) {
        throw new UnauthorizedException(
          'Unauthorized, You can not perform this call',
        );
      }
      // Continue to the next middleware or controller
      next();
    } catch (error) {
      logger.error(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
