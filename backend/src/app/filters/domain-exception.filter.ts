import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { isDomainError } from '@helena-art-store/core/utils';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request & { correlationId?: string }>();

    if (isDomainError(exception)) {
      this.logger.warn(
        `${exception.code}: ${exception.message}`,
        request?.correlationId ?? 'DomainException',
      );
      return response.status(exception.statusCode).json({
        error: exception.code,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    this.logger.error('Unhandled error', exception as Error);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'UNEXPECTED_ERROR',
      message: 'An unexpected error occurred.',
      timestamp: new Date().toISOString(),
    });
  }
}
