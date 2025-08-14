import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.USE_LOGS !== 'true') return next();

    const start = Date.now();

    // Log incoming request immediately
    console.log(`➡️  ${req.method} ${req.originalUrl} - Incoming`);

    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusEmoji = res.statusCode >= 400 ? '❌' : '✅';
      console.log(`${statusEmoji} ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
  }
}
