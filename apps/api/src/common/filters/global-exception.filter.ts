import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

interface ErrorResponse {
  error: string;
  statusCode: number;
  timestamp: string;
}

interface HttpResponse {
  status: (code: number) => { json: (body: ErrorResponse) => void };
}

/**
 * Catches everything and returns a consistent { error, statusCode, timestamp }.
 * Stack traces are logged server-side only and never sent to the client.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      error = this.extractMessage(exception);
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Database error';
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(statusCode).json({
      error,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    const message = (response as { message?: string | string[] }).message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    return message ?? exception.message;
  }
}
