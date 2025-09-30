import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { correlationId?: string }>();
    const response = context.switchToHttp().getResponse();
    const correlationId = request.headers['x-request-id']?.toString() ?? randomUUID();

    request.correlationId = correlationId;
    response.setHeader('x-request-id', correlationId);

    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - startedAt;
        this.logger.debug(
          `${request.method} ${request.url} -> ${response.statusCode} (${elapsed}ms)`,
          correlationId,
        );
      }),
    );
  }
}
