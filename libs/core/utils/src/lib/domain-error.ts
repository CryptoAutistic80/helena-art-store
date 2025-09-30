export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export const isDomainError = (error: unknown): error is DomainError =>
  error instanceof DomainError;

export const createDomainError = (
  code: string,
  message: string,
  statusCode = 400,
  cause?: unknown,
): DomainError => new DomainError(code, message, statusCode, cause);
