import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

type HttpErrorPayload = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

function isHttpErrorPayload(x: unknown): x is HttpErrorPayload {
  return typeof x === 'object' && x !== null && ('message' in x || 'error' in x || 'statusCode' in x);
}

function isPgUniqueViolation(e: unknown): e is { code: string } {
  return typeof e === 'object' && e !== null && (e as { code?: string }).code === '23505';
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (isHttpErrorPayload(payload)) {
        message = payload.message ?? payload.error ?? 'Error';
        if (Array.isArray(payload.message)) {
          errors = payload.message;
        }
      }
    } else if (isPgUniqueViolation(exception)) {
      status = HttpStatus.CONFLICT;
      message = 'Resource already exists';
    }

    res.status(status).json({
      status: 'error',
      code: status,
      message,
      errors,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
