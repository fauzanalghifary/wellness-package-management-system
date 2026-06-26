import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

export const AppZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: unknown) => {
    const issues = error instanceof ZodError ? error.issues : [];

    return new BadRequestException({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      }
    });
  }
});
